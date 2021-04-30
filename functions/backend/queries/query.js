// const playerIDToNameMap = require("../lookups/playerIDToNameMap.json");
// const teamIDToNameMap = require("../lookups/teamIDToNameMap.json");

module.exports.Query = class Query {
    constructor(meta, queryForm) {
        this.dims = meta.dims;
        this.aggs = meta.aggs;
        this.fltrs = meta.fltrs;
        this.tbls = meta.tbls;
        this.row = queryForm.row;
        this.columns = queryForm.columns;
        this.where = queryForm.where;
    }

    // -----------------------------------------------------------------------------------------------------------------------------
    // Building SQL String
    // -----------------------------------------------------------------------------------------------------------------------------

    /** Given a filter name (pass_pocket_time) and values ([0, 3.5])
     **   (note: filters must be 'clean' - no undefined or null values)
     **   returns a SQL string => `pass_pocket_time BETWEEN 0 AND 3.5`
     */
    buildFilterSQL(name, values) {
        const { sql, singleOperator, multipleOperator, joiner, dataType } = this.fltrs[name];
        if (!Array.isArray(values)) {
            const escaped = dataType === "string" ? `'${values}'` : values;
            return `${sql} ${singleOperator} ${escaped}`;
        } else {
            const escaped = dataType === "string" ? values.map((value) => `'${value}'`) : values;
            const input = escaped.join(joiner);
            if (multipleOperator === "BETWEEN") {
                return `${sql} ${multipleOperator} ${input}`; // BETWEEN can't take parentheses :shrug_emoji:
            } else {
                return `${sql} ${multipleOperator} (${input})`;
            }
        }
    }

    /** Given a column object {field: 'sum_yds_pass', title: 'Pass Yards', filters: [...] }
     **   returns a SQL string => `SUM(CASE WHEN pass_was_blitzed = 1 ... THEN yds_pass ELSE NULL END)`
     **   Note: the 'AS' alias should NOT be here because I need this function for HAVING
     */
    buildColumnSQL(column) {
        const { field, filters } = column;
        const { sql } = this.aggs[field];
        if (!filters) {
            return sql;
        }
        // turn {activeFilter: 'season_year', season_year: [2020, 2019]}  into  {activeFilter: 'season_year', values: [2020, 2019]}
        // and clean out undefined values (shouldn't occurr, due to form validation in front end, but just in case)
        const cleanFilters = filters
            .map((filter) => ({ activeFilter: filter.activeFilter, values: filter[filter.activeFilter] }))
            .filter((filter) => typeof filter.values !== "undefined");
        if (cleanFilters.length === 0) {
            return sql;
        }
        // build SQL array like: [season_year IN (2019, 2020"), pass_pocket_time BETWEEN 0 AND 2.5]
        const filtersSQLArray = cleanFilters.map((filter) => this.buildFilterSQL(filter.activeFilter, filter.values));
        const filtersSQLString = filtersSQLArray.join(" AND ");
        return sql.replace(/true/g, `true AND ${filtersSQLString}`); //TODO- use replaceAll
    }

    /** Given an array of columns --> [{field, title, filters}, {field, title, filters}]
     **   returns a SQL array => [`SUM(...)`, `AVG(...)`]
     */
    buildSelectColumns() {
        return this.columns.map((column, index) => `${this.buildColumnSQL(column)} AS col${index + 1}`);
    }

    /** Given an API request, builds the row portion of the SQL statement
     *     returns a SQL string => 'player_name_with_position'
     */
    buildSelectRow() {
        const rowName = this.row.field;
        return `${this.dims[rowName].sql}`;
    }

    // DEPRECATED: I have decided to remove this functionality; the new form UI renders this less necessary;
    //      the new UI prompts the user to enter season_year as a row filter rather than as a column filter
    // --------------------------------------------------------------------------------------------------
    /** Given an row type field name (i.e. season_year, player_gsis_id, etc.), conditionally builds a SQL string filter
     *  This helps to filter the data, especially for season_year (bc the table is partitioned on that)
     *    filter will only be built if both of the below are true:
     *    (1) every column includes a filter for that field
     *    (2) there is no WHERE filter for that field already
     *    otherwise it will return an empty string
     */
    // buildFilterForRowType(rowName) {
    //     const allValues = Object.entries(this.columns)
    //         .filter(([colIndex, column]) => column.filters && column.filters[rowName]) // filter to only columns which include this filter
    //         .map(([colIndex, column]) => column.filters[rowName]); // return array of all values, i.e [2018, 2019]
    //     const columnsCount = Object.keys(this.columns).length; // returns length of columns, i.e. 3
    //     if (allValues.length !== columnsCount) {
    //         // check condition (1)
    //         return "";
    //     } else if (Object.keys(this.where).includes(rowName)) {
    //         // check condition (2)
    //         return "";
    //     } else {
    //         return this.buildFilterSQL(rowName, Array.from(new Set(allValues))); // Set() will remove duplicates
    //     }
    // }

    /** Given an API request, builds an array of the WHERE portion of the SQL statement
     *    returns a SQL array => [`season_year IN (2019, 2020)`, `stat_type IN ('pass', 'rush')`...]
     */
    buildWhere() {
        // create array of SQL strings with what is in the WHERE portion of the request
        const whereArr = Object.entries(this.where)
            .filter(([name, values]) => values && (Array.isArray(values) ? values.length > 0 : true))
            .map(([name, values]) => this.buildFilterSQL(name, values));

        // const rowTypes = ["season_year", "player_gsis_id", "team_id"];
        // rowTypes.forEach((rowName) => {
        //     const filter = this.buildFilterForRowType(rowName);
        //     if (filter) {
        //         whereArr.push(filter);
        //     }
        // });

        // append stat_type filter based on what is in the columns
        //   if the stat field is an "info" type (e.g. games_played), then no stat_type filter is appended
        const hasInfoAgg = this.columns.filter((column) => column.field.slice(0, 4) === "info").length > 0;
        if (!hasInfoAgg) {
            const statsWithDuplicates = this.columns
                .filter((column) => ["pass", "rush", "recv"].includes(column.field.slice(0, 4)))
                .map((column) => `${column.field.slice(0, 4)}`);
            const stats = Array.from(new Set(statsWithDuplicates));
            whereArr.push(this.buildFilterSQL("stat_type", stats));
        }

        // query should always include this; removes plays nullified by penalties
        whereArr.push("nullified IS NULL");
        return whereArr;
    }

    /** Given an API request, builds an array of the HAVING portion of the SQL statement
     *     returns a SQL array => [`SUM(pass_attempts...) >= 100`, ...]
     */
    buildHaving() {
        return this.columns.filter((column) => column.having).map((column) => `(${this.buildColumnSQL(column)}) >= ${column.having}`);
    }

    /**
     * Given an API request and metadata, returns the SQL statement ready for execution in database
     *      returns a SQL string => `SELECT... FROM... WHERE... GROUP BY... HAVING...`
     */
    buildSQL() {
        const rowSQL = this.buildSelectRow();
        const columnArr = this.buildSelectColumns();
        const whereArr = this.buildWhere();
        const havingArr = this.buildHaving();
        const orderBy = rowSQL === `${this.dims.season_year.sql}` ? "2 ASC" : "3 DESC";

        let sql = "";
        sql += `SELECT ' ' AS rnk,\n`;
        sql += `${rowSQL},\n`; // this is the actual row for the table
        sql += `${columnArr.join(", \n")}`;
        sql += `\nFROM ${this.tbls.prod.sqlName}`;
        sql += whereArr.length > 0 ? `\nWHERE ${whereArr.join(" AND \n")}` : "";
        sql += "\nGROUP BY 1, 2";
        sql += havingArr.length > 0 ? `\nHAVING ${havingArr.join(" AND \n")}` : "";
        sql += `\nORDER BY ${orderBy}`;

        return sql;
    }

    // -----------------------------------------------------------------------------------------------------------------------------
    // Building Table Props
    // -----------------------------------------------------------------------------------------------------------------------------

    /** Given a colIndex (col1) & column object {field: 'sum_yds_pass', filters: [...] }
     **   returns a tableProps object => {dataIndex, title, width ...}
     */
    buildColumnTableProps(column, colIndex) {
        const { field, title } = column;
        const { shortTitle, width, dataType, format } = this.aggs[field];
        // default title will include year if year is selected
        const defaultTitle = `${shortTitle}`;

        // DEPRECATED: too difficult to infer a column title now, with filts at both row and col level
        // const seasonYear = !filters.season_year ? "" : ` (${filters.season_year})`;
        // const playerName = !filters.player_gsis_id ? "" : ` (${playerIDToNameMap[filters.player_gsis_id]})`;
        // const teamName = !filters.team_id ? "" : ` (${teamIDToNameMap[filters.team_id]})`;
        // const defaultTitle = `${shortTitle}` + seasonYear + playerName + teamName;

        return {
            title: `Col ${colIndex.slice(3)}`,
            align: "center",
            key: `wrapper_${colIndex}`,
            children: [
                {
                    dataIndex: colIndex,
                    key: colIndex,
                    title: title || defaultTitle, // use provided title or default title if none provided
                    width: width,
                    dataType: dataType,
                    format: format,
                    align: "right",
                },
            ],
        };
    }

    /** Given an array of columns --> [{field: 'sum_yds_pass', title: 'Total Pass', filters: [...]}, {} ... ]
     **   returns a tableProps array => [{dataIndex: col1, title, ..}, {dataIndex: col2, title, ...}]
     */
    buildColumnsTablePropsArray() {
        return this.columns.map((column, index) => this.buildColumnTableProps(column, `col${index + 1}`));
    }

    /**
     * Given an API request and metadata, builds the AntD table properties
     *     returns AntD tableProps object
     */
    buildTableProps() {
        const { sql, shortTitle, width, dataType, format } = this.dims[this.row.field];
        return [
            {
                // this is the leading "#" column in the table
                dataIndex: "rnk",
                key: "rnk",
                title: "#",
                width: "50px",
                align: "center",
                fixed: "left",
                format: "index",
            },
            {
                // get the table properties for the row
                dataIndex: sql,
                key: sql,
                title: shortTitle,
                width: width,
                dataType: dataType,
                format: format,
                align: "left",
                fixed: "left",
            },
            ...this.buildColumnsTablePropsArray(),
        ];
    }
};
