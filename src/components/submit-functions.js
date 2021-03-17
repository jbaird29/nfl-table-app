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
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toLocaleString(undefined,{minimumFractionDigits: 1, maximumFractionDigits: 1})}`}</span>)
    } else if (column.format === 'dec_2') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>)
    } else if (column.format === 'percent') {
        column.render = (text, row, index) => (!text ? text : <span>{`${(text*100).toLocaleString(undefined,{minimumFractionDigits: 2, maximumFractionDigits: 2})}%`}</span>)
    } else if (column.format === 'index') {
        column.render = (text, row, index) => (!text ? text : <span>{`${index + 1}`}</span>)
    }
}

export function buildRequestBody(body) {
    const output = {}
    output.row = body.row
    output.columns = []
    output.where = []
    output.having = []
    const years = []
    const statTypes = []
    for (const key in body) {
        if (key.startsWith('col')) {
            const column = {}
            const columnID = key.slice(3) // extracts '10' from 'col10'
            column.id = columnID
            column.field = body[key].field
            if (body[key].field.includes('pass')) { statTypes.push(`'pass'`) }
            if (body[key].field.includes('rush')) { statTypes.push(`'rush'`) }
            if (body[key].field.includes('recv')) { statTypes.push(`'receive'`) }
            // for each column, loop through its filters
            column.filters = []
            for (const colEntry in body[key]) {
                if (colEntry.startsWith('filter')) {
                    for (const filterName in body[key][colEntry]) {
                        if (filterName === 'year') { years.push(body[key][colEntry][filterName])}
                        let value = body[key][colEntry][filterName]
                        if (typeof(value) !== "undefined" && value !== null) {
                            value = Array.isArray(value) ? value : [value]
                            column.filters.push({field: filterName, values: value})    
                        }
                    }
                } else if (colEntry === 'having') {
                    const value = body[key][colEntry]
                    if (typeof(value) !== "undefined" && value !== null) {
                        output.having.push({id: columnID, value: value})
                    }
                }
            }
            output.columns.push(column)
        }
    }
    output.where.push({field: 'year', values: years})
    output.where.push({field: 'stat_type', values: statTypes})
    return output
}

export async function makeRequest(params) {
    const fetchOptions = { method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(params)
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