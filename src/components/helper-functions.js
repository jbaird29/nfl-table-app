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
export function buildTableCalcColumn(calcIndex, customCalc, prevColumns) {
    const {colIndex1, operation, colIndex2, format, title} = customCalc
    const newColumn = {
        title: `Calculation ${calcIndex.slice(4)}`,  // extracts '10' from 'calc10'
        align: 'center',
        children: [{
            dataIndex: calcIndex, 
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
export function buildTableCalcDataSource(calcIndex, customCalc, prevDataSource) {
    const {colIndex1, operation, colIndex2, format, title} = customCalc
    return prevDataSource.map(dataSource => {
        const newDataSource =  (operation === '/' ? dataSource[colIndex1] / dataSource[colIndex2] :
                                operation === '*' ? dataSource[colIndex1] * dataSource[colIndex2] :
                                operation === '+' ? dataSource[colIndex1] + dataSource[colIndex2] :
                                operation === '-' ? dataSource[colIndex1] - dataSource[colIndex2] :
                                null)
        return {...dataSource, [calcIndex]: newDataSource}
    })
}


export function toCSV(tableData) {
    const {dataSource, columns} = tableData
    const columnsWithoutRnk = columns.filter(col => col.dataIndex !== 'rnk')
    const headerOneString = columnsWithoutRnk.map(col => !col.children ? "" : `"${col.title}"`).join(',')
    const headerTwoString = columnsWithoutRnk.map(col => !col.children ? `"${col.title}"` : `"${col.children[0].title}"`).join(',')
    const dataIndexes = columnsWithoutRnk.map(col => !col.children ? col.dataIndex : col.children[0].dataIndex)
    
    const rowStringArray = dataSource.map(dataObj => {
        const rowArrray = dataIndexes.map(dataIndex => `"${dataObj[dataIndex]}"`)  // this ensures data is same order as the headers
        return rowArrray.join(',')
    })

    return `${headerOneString}\n${headerTwoString}\n${rowStringArray.join('\n')}`
}