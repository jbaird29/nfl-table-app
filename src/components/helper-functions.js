/**
 * Given a TableProps column object, adds a sorter function depending on format type
 * @param {Object} column - tableProps Column
 */
export function addSorter(column) {
    if (column.dataType === 'number') {
        const columnName = column.dataIndex
        column.sorter = (a, b) => a[columnName] - b[columnName]
    } else if (column.dataType === 'string') {
        const columnName = column.dataIndex
        column.sorter = (a, b) => (a[columnName].toUpperCase() < b[columnName].toUpperCase() ? -1 : 1)
    }
}

/**
 * Given a TableProps column object, adds a render function depending on format type
 * @param {Object} column - tableProps Column
 */
export function addRender(column) {
    if (column.format === 'dec_0') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toLocaleString()}`}</span>)
    } else if (column.format === 'dec_1') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toLocaleString(undefined,{minimumFractionDigits: 1, maximumFractionDigits: 1})}`}</span>)
    } else if (column.format === 'dec_2') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>)
    } else if (column.format === 'percent') {
        column.render = (text, row, index) => (!text ? text : <span>{`${(text*100).toLocaleString(undefined,{minimumFractionDigits: 1, maximumFractionDigits: 1})}%`}</span>)
    } else if (column.format === 'index') {
        column.render = (text, row, index) => (!text ? text : <span>{`${index + 1}`}</span>)
    }
}

/**
 * Given a queryFields state object, formats the state into a manner necessary for the API request
 * @param {Object} queryFields 
 * @returns {Object} apiRequestBody 
 */
export function buildRequestBody(queryFields) {
    const output = {
        row: queryFields.row,
        columns: [],
        where: [],
        having: []
    }
    const statTypes = []    

    // modify the column into appropriate formate for API request
    queryFields.columns.forEach(column => {
        // append the appropriate statType filter based on the field
        if (column.field.includes('pass')) { statTypes.push(`'pass'`) }
        if (column.field.includes('rush')) { statTypes.push(`'rush'`) }
        if (column.field.includes('recv')) { statTypes.push(`'receive'`) }
        // create the column filters
        const filters = []
        // this gets an array like ['filters_pass', 'filters_rush', 'filters_general']
        const filterKeys =  Object.keys(column).filter(key => key.startsWith('filter'))
        filterKeys.forEach(filterKey => {
            // turn the object like {blitzed: 1, on_target: 0} -> into {field: blitzed, value: [1]...}
            for (const filterName in column[filterKey]) {
                let values = column[filterKey][filterName]
                if (typeof(values) !== 'undefined' && values !== 'either') {
                    values = Array.isArray(values) ? values : [values]
                    filters.push({field: filterName, values: values})
                }
            }
        })
        output.columns.push({
            id: column.colIndex.slice(3),  // extracts '10' from 'col10'
            field: column.field,           // the name like 'sum_pass_att'
            title: column.title || null,   // the user-entered column title, if any
            filters: filters               // the filter array created above [{field: season_year, values: ['2020']}, {field: ...}]
        })
        // append the 'having' portion
        if (column.having && typeof(column.having) !== 'undefined') {
            output.having.push({id: column.colIndex.slice(3), value: column.having})
        }
    })
    // push the required years and stat type filters
    const years = Array.from(new Set(queryFields.columns.map(column => column.filters_general.season_year)))
    output.where.push({field: 'season_year', values: years})
    output.where.push({field: 'stat_type', values: Array.from(new Set(statTypes)) })
    // sort the columns by id
    output.columns.sort((a, b) => a.id - b.id)
    return output
}


/**
 * Given an apiRequestBody, makes the request and returns the tableData
 * @param {Object} params 
 * @returns {Object} tableData
 */
export async function makeRequest(apiRequestBody) {
    const fetchOptions = { method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(apiRequestBody)
    }
    const response = await fetch(`http://localhost:9000/run-query`, fetchOptions)
    const tableData = await response.json();

    // for each column, add (1) sorter function (2) render function
    tableData.columns.forEach(column => {
        if ('children' in column) {
            column.children.forEach(child => {
                addSorter(child);
                addRender(child);
            })
        } else {
            addSorter(column);
            addRender(column);
        }
    })
    // add the new response to the tableData state
    return tableData
}


/**
 * Given a customCalc Object and the array of previous tableData.columns, creates the new array of tableData.columns
 * @param {*} customCalc 
 * @param {*} prevColumns 
 * @returns tableData.columns
 */
export function buildTableCalcColumn(customCalc, prevColumns) {
    const {calcIndex, colIndex1, operation, colIndex2, format, title} = customCalc
    const newColumnIndex = calcIndex
    const newColumn = {
        title: `Calculation ${calcIndex.slice(4)}`,  // extracts '10' from 'calc10'
        align: 'center',
        children: [{
            dataIndex: newColumnIndex, 
            title: title,
            align: "right",
            width: "75px",
            className: 'custom-calc',
            format: format,
            dataType: 'number'
        }]
    }
    addRender(newColumn.children[0])
    addSorter(newColumn.children[0])
    return [...prevColumns, newColumn]
}


/**
 * Given a customCalc Object and the array of previous tableData.dataSource, creates the new array of tableData.dataSource
 * @param {*} customCalc 
 * @param {*} prevDataSource 
 * @returns tableData.dataSource
 */
export function buildTableCalcDataSource(customCalc, prevDataSource) {
    const {calcIndex, colIndex1, operation, colIndex2, format, title} = customCalc
    return prevDataSource.map(dataSource => {
        const newDataSource = (operation === '/' ? dataSource[colIndex1] / dataSource[colIndex2] :
        operation === '*' ? dataSource[colIndex1] * dataSource[colIndex2] :
        operation === '+' ? dataSource[colIndex1] + dataSource[colIndex2] :
        operation === '-' ? dataSource[colIndex1] - dataSource[colIndex2] :
        null)
        return {...dataSource, [calcIndex]: newDataSource}
    })
}