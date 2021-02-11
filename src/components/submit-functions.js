// add sort functions depending on data type
export function addSorter(column) {
    if (column.dataType === 'number') {
        const columnName = column.dataIndex
        column.sorter = (a, b) => a[columnName] - b[columnName]
    } else if (column.dataType === 'string') {
        const columnName = column.dataIndex
        column.sorter = (a, b) => (a[columnName].toUpperCase() < b[columnName].toUpperCase() ? -1 : 1)
    }
}

// add render functions depending on format type
export function addRender(column) {
    if (column.format === 'dec_0') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toLocaleString()}`}</span>)
    } else if (column.format === 'dec_1') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toFixed(1).toLocaleString()}`}</span>)
    } else if (column.format === 'dec_2') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toFixed(2).toLocaleString()}`}</span>)
    } else if (column.format === 'index') {
        column.render = (text, row, index) => (!text ? text : <span>{`${index + 1}`}</span>)
    }
}

export function buildRequestBody(values) {
    // row: can be inserted 'as-is'
    const row = values.row
    // years: fill out the array; original array is [2018, 2020] this makes it [2020, 2019, 2018]
    const years = []
    for (let i = values.years[1]; i >= values.years[0]; i--) {
        years.push(i)
    }
    // stats: if stat type's value is not 'undefined', add its value to the array
    const stats = []
    for (const statType in values.stats) {
        values.stats[statType] && stats.push(...values.stats[statType])
    }
    // where & having: if where and having are not undefined, add them, otherwise make it an empty object
    const whereObj = values.where || {}
    const havingObj = values.having || {}
    // turn where and having from object into an array of type: [{ field: 'inside_20', values: [1]}, ...]
    const where = Object.entries(whereObj).map(entry => {
        if (entry[1]) {  // if the value  is not undefined or empty, add it, otherwise add undefined
            const key = entry[0]
            const values = Array.isArray(entry[1]) ? entry[1] : [entry[1]]  // makes values an array, even if single item
            return {field: key, values: values}
        }
    }).filter(entry => entry)
    const having = Object.entries(havingObj).map(entry => {
        if (entry[1]) {
            const key = entry[0]
            const value = entry[1] // for HAVING, value is single number (always >= for now)
            return {field: key, value: value}
        }
    }).filter(entry => entry)
    // return the request body
    return {row: row, years: years, stats: stats, where: where, having: having}
}

export async function makeRequest(body) {
    const fetchOptions = { method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    }
    const response = await fetch(`http://localhost:9000/query`, fetchOptions)
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