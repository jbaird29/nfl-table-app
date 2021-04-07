const playerIDToNameMap = require('../lookups/playerIDToNameMap.json')
const teamIDToNameMap = require('../lookups/teamIDToNameMap.json')

module.exports.Query = class Query {
    constructor(meta, queryForm) {
        this.dims = meta.dims
        this.aggs = meta.aggs
        this.fltrs = meta.fltrs
        this.tbls = meta.tbls
        this.row = queryForm.row
        this.columns = queryForm.columns
        this.where = queryForm.where
    }


    // -----------------------------------------------------------------------------------------------------------------------------
    // Building SQL String
    // -----------------------------------------------------------------------------------------------------------------------------

    /** Given a filter name (pass_pocket_time) and values ([0, 3.5])
     **   (note: filters must be 'clean' - no undefined or null values)
     **   returns a SQL string => `pass_pocket_time BETWEEN 0 AND 3.5`
    */ 
    buildFilterSQL(name, values) {
        const {sql, singleOperator, multipleOperator, joiner, dataType} = this.fltrs[name]
        if (!Array.isArray(values)) {
            const escaped = dataType === 'string' ? `'${values}'` : values
            return `${sql} ${singleOperator} ${escaped}`
        } else {
            const escaped = dataType === 'string' ? values.map(value => `'${value}'`) : values
            const input = escaped.join(joiner)
            if (multipleOperator === 'BETWEEN') {
                return `${sql} ${multipleOperator} ${input}`                    // BETWEEN can't take parentheses
            } else {
                return `${sql} ${multipleOperator} (${input})`
            }
        } 
    }

    /** Given a column object {field: 'sum_yds_pass', filters: {pass_was_blitzed: 1, pass_pocket_time: [0, 3.5]} }
     **   returns a SQL string => `SUM(CASE WHEN pass_was_blitzed = 1 ... THEN yds_pass ELSE NULL END)`
     **   Note: the 'AS' alias should NOT be here because I need this function for HAVING    
    */ 
    buildColumnSQL(column) {
        const {field, filters} = column
        const {sql} = this.aggs[field]
        const filtersSQLArray = Object.entries(filters)
                                .filter(([name, values]) => values && (Array.isArray(values) ? values.length > 0 : true))
                                .map(([name, values]) => (this.buildFilterSQL(name, values)))
        if (filtersSQLArray.length > 0) {
            const filtersSQLString = filtersSQLArray.join(' AND ')
            return sql.replace(/true/g, `true AND ${filtersSQLString}`)  //TODO- use replaceAll
        } else {
            return sql
        }
    }

    /** Given an object of columns --> {col1: {field, filters}, col2: {field, filters} }
     **   returns a SQL array => [`SUM(...)`, `AVG(...)`]
    */ 
    buildSelectColumns() {
        return Object.entries(this.columns).sort((a, b) => a[0].slice(3) - b[0].slice(3))  // slices 1 from col1, and sorts
                .map(([colIndex, column]) => `${this.buildColumnSQL(column)} AS ${colIndex}`)
    }

    /** Given an API request, builds the row portion of the SQL statement
     *     returns a SQL string => 'player_name_with_position'
    */ 
    buildSelectRow() {
        const rowName = this.row.field
        return `${this.dims[rowName].sql}`
    }

    /** Given an API request, builds an array of the WHERE portion of the SQL statement
     *    returns a SQL array => [`season_year IN (2019, 2020)`, `stat_type IN ('pass', 'rush')`...]
    */ 
    buildWhere() {
        // create array of SQL strings with what is in the WHERE portion of the request
        const whereArr = !this.where ? [] : 
                Object.entries(this.where)
                .filter(([name, values]) => values && (Array.isArray(values) ? values.length > 0 : true))
                .map(([name, values]) => this.buildFilterSQL(name, values))

        const columnsCount = Object.keys(this.columns).length

        // append season_year filter based on what is in the columns ONLY IF every column includes a filter for that
        const years = Object.entries(this.columns).filter(([colIndex, column]) => column.filters.season_year)
            .map(([colIndex, column]) => column.filters.season_year)
        if (years.length === columnsCount) {
            whereArr.push(this.buildFilterSQL('season_year', Array.from(new Set(years)) ))
        }
        
        // append player_name filter based on what is in the columns ONLY IF every column includes a filter for that
        const players = Object.entries(this.columns).filter(([colIndex, column]) => column.filters.player_gsis_id)
            .map(([colIndex, column]) => column.filters.player_gsis_id)
        if (players.length === columnsCount) {
            whereArr.push(this.buildFilterSQL('player_gsis_id', Array.from(new Set(players)) ))
        }
    
        // append team_name filter based on what is in the columns ONLY IF every column includes a filter for that
        const teams = Object.entries(this.columns).filter(([colIndex, column]) => column.filters.team_id)
            .map(([colIndex, column]) => column.filters.team_id)
        if (teams.length === columnsCount) {
            whereArr.push(this.buildFilterSQL('team_id', Array.from(new Set(teams)) ))
        }

        // append stat_type filter based on what is in the columns
        //   if the stat field is an "info" type, then no stat_type filter is appended
        const hasInfoAgg = Object.entries(this.columns).filter(([colIndex, column]) => column.field.slice(0, 4) === 'info').length > 0
        if (!hasInfoAgg) {
            const statsWithDuplicates = Object.entries(this.columns)
                .filter(([colIndex, column]) => ['pass', 'rush', 'recv'].includes(column.field.slice(0, 4)))
                .map(([colIndex, column]) => `${column.field.slice(0, 4)}`)
            const stats = Array.from(new Set(statsWithDuplicates))
            whereArr.push(this.buildFilterSQL('stat_type', stats))
        }
        
        // query should always include this; removes plays nullified by penalties
        whereArr.push('nullified IS NULL')
        return whereArr
    }
    
    /** Given an API request, builds an array of the HAVING portion of the SQL statement
     *     returns a SQL array => [`SUM(pass_attempts...) >= 100`, ...]
    */ 
    buildHaving() {
        return Object.entries(this.columns)
                .filter(([colIndex, column]) => column.having)
                .map(([colIndex, column]) => `(${this.buildColumnSQL(column)}) >= ${column.having}` )    
    }

    /**
     * Given an API request and metadata, returns the SQL statement ready for execution in database
     *      returns a SQL string => `SELECT... FROM... WHERE... GROUP BY... HAVING...`
     */
    buildSQL() {
        const rowSQL = this.buildSelectRow()
        const columnArr = this.buildSelectColumns()
        const whereArr = this.buildWhere()
        const havingArr = this.buildHaving()
        const orderBy = rowSQL === `${this.dims.season_year.sql}` ? '2 ASC' : '3 DESC'

        let sql = ''
        sql += `SELECT ' ' AS rnk,\n`
        sql += `${rowSQL},\n`         // this is the actual row for the table
        sql += `${columnArr.join(', \n')}`
        sql += `\nFROM ${this.tbls.prod.sqlName}`
        sql += whereArr.length > 0 ? `\nWHERE ${whereArr.join(' AND \n')}` : ''
        sql += '\nGROUP BY 1, 2'
        sql += havingArr.length > 0 ? `\nHAVING ${havingArr.join(' AND \n')}` : ''
        sql += `\nORDER BY ${orderBy}`

        return sql
    }



    // -----------------------------------------------------------------------------------------------------------------------------
    // Building Table Props
    // -----------------------------------------------------------------------------------------------------------------------------

    /** Given a colIndex (col1) & column object {field: 'sum_yds_pass', filters: {pass_was_blitzed: 1, pass_pocket_time: [0, 3.5]} }
     **   returns a tableProps object => {dataIndex, title, width ...}
    */ 
    buildColumnTableProps(colIndex, column) {
        const {field, title, filters} = column
        const {shortTitle, width, dataType, format, } = this.aggs[field]
        // default title will include year if year is selected
        const seasonYear = !filters.season_year ? '' : ` (${filters.season_year})`
        const playerName = !filters.player_gsis_id ? '' : ` (${playerIDToNameMap[filters.player_gsis_id]})`
        const teamName = !filters.team_id ? '' : ` (${teamIDToNameMap[filters.team_id]})`
        const defaultTitle = `${shortTitle}` + seasonYear + playerName + teamName
        return ({
            title: `Col ${colIndex.slice(3)}`, 
            align: 'center', 
            key: `wrapper_${colIndex}`,
            children: [{
                dataIndex: colIndex
                , key: colIndex
                , title: title || defaultTitle  // use provided title or default title if none provided
                , width: width
                , dataType: dataType
                , format: format
                , align: 'right'
            }]
        })
    }

    /** Given an object of columns --> {col1: {field: 'sum_yds_pass', filters: {...} }, col2: {field: ... } }
     **   returns a tableProps array => [{dataIndex: col1, title, ..}, {dataIndex: col2, title, ...}]
    */ 
    buildColumnsTablePropsArray() {
        return Object.entries(this.columns).sort((a, b) => a[0].slice(3) - b[0].slice(3))  // slices 1 from col1, and sorts
                .map(([colIndex, column]) => this.buildColumnTableProps(colIndex, column))
    }

    /**
     * Given an API request and metadata, builds the AntD table properties
     *     returns AntD tableProps object
     */
    buildTableProps() {
        const {sql, shortTitle, width, dataType, format, } = this.dims[this.row.field]
        return [{
            // this is the leading "#" column in the table
            dataIndex: 'rnk'
            , key: 'rnk'
            , title: '#'
            , width: '50px'
            , align: 'center'
            , fixed: 'left'
            , format: 'index'
            }, {
            // get the table properties for the row
            dataIndex: sql
            , key: sql
            , title: shortTitle
            , width: width
            , dataType: dataType
            , format: format
            , align: 'left'
            , fixed: 'left'
        }, 
        ...this.buildColumnsTablePropsArray() ]
    }

}