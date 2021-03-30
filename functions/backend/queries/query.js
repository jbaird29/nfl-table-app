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
        const {sql, singleOperator, multipleOperator, joiner} = this.fltrs[name]
        if (!Array.isArray(values)) {
            return `${sql} ${singleOperator} ${values}`
        } else if (multipleOperator === 'BETWEEN') {
            return `${sql} ${multipleOperator} ${values.join(joiner)}`
        } else {
            return `${sql} ${multipleOperator} (${values.join(joiner)})`
        }
    }

    /** Given a column object {field: 'sum_yds_pass', filters: {pass_was_blitzed: 1, pass_pocket_time: [0, 3.5]} }
     **   returns a SQL string => `SUM(CASE WHEN pass_was_blitzed = 1 ... THEN yds_pass ELSE NULL END)`
    */ 
    buildColumnSQL(column) {
        const {field, filters} = column
        const {sql} = this.aggs[field]
        const filtersSQLArray = Object.entries(filters)
                                .filter(([name, values]) => values && (Array.isArray(values) ? values.length > 0 : true))
                                .map(([name, values]) => (this.buildFilterSQL(name, values)))
        const filtersSQLString = filtersSQLArray.join(' AND ')
        const queryString = sql.replace(/true/g, `true AND ${filtersSQLString}`)  //TODO- use replaceAll
        return `${queryString}`   // Note: the 'AS' alias should NOT be here because I need this function for HAVING
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
        const whereArr = Object.entries(this.where)
                        .filter(([name, values]) => values && (Array.isArray(values) ? values.length > 0 : true))
                        .map(([name, values]) => this.buildFilterSQL(name, values))

        // append season_year filter based on what is in the columns
        const yearsWithDuplicates = Object.entries(this.columns).map(([colIndex, column]) => column.filters.season_year)
        const years = Array.from(new Set(yearsWithDuplicates))
        whereArr.push(this.buildFilterSQL('season_year', years))

        // append stat_type filter based on what is in the columns
        //   if the stat field is an "info" type, then no stat_type filter is appended
        const hasInfoAgg = Object.entries(this.columns).filter(([colIndex, column]) => column.field.slice(0, 4) === 'info').length > 0
        if (!hasInfoAgg) {
            const statsWithDuplicates = Object.entries(this.columns)
                                    .filter(([colIndex, column]) => ['pass', 'rush', 'recv'].includes(column.field.slice(0, 4)))
                                    .map(([colIndex, column]) => `"${column.field.slice(0, 4)}"`)
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

        let sql = ''
        sql += `SELECT ' ' AS rnk,\n`
        sql += `${rowSQL},\n`         // this is the actual row for the table
        sql += `${columnArr.join(', \n')}`
        sql += `\nFROM ${this.tbls.prod.sqlName}`
        sql += whereArr.length > 0 ? `\nWHERE ${whereArr.join(' AND \n')}` : ''
        sql += '\nGROUP BY 1, 2'
        sql += havingArr.length > 0 ? `\nHAVING ${havingArr.join(' AND \n')}` : ''
        sql += '\nORDER BY 3 DESC'

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
        return ({
            title: `Column ${colIndex.slice(3)}`, 
            align: 'center', 
            key: `wrapper_${colIndex}`,
            children: [{
                dataIndex: colIndex
                , key: colIndex
                , title: title || `${shortTitle} (${filters.season_year})`   // user-entered title || default one
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