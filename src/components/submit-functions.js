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
        column.render = (text, row, index) => (!text ? text : <span>{`${(text*100).toLocaleString(undefined,{minimumFractionDigits: 1, maximumFractionDigits: 1})}%`}</span>)
    } else if (column.format === 'index') {
        column.render = (text, row, index) => (!text ? text : <span>{`${index + 1}`}</span>)
    }
}

export function buildRequestBody(body) {
    const output = {
        row: body.row,
        columns: [],
        where: [],
        having: []
    }
    const statTypes = []    

    // modify the column into appropriate formate for API request
    body.columns.forEach(column => {
        // append the appropriate statType filter based on the field
        if (column.field.includes('pass')) { statTypes.push(`'pass'`) }
        if (column.field.includes('rush')) { statTypes.push(`'rush'`) }
        if (column.field.includes('recv')) { statTypes.push(`'receive'`) }
        // create the column filters
        const filters = []
        // this gets an array like ['filtersPass', 'filtersRush', 'filtersOther']
        const filterKeys =  Object.keys(column).filter(key => key.startsWith('filter'))
        filterKeys.forEach(filterKey => {
            // turn the object like {blitzed: 1, on_target: 0} -> into {field: blitzed, value: [1]...}
            for (const filterName in column[filterKey]) {
                let values = column[filterKey][filterName]
                values = Array.isArray(values) ? values : [values]
                filters.push({field: filterName, values: values})
            }
        })
        output.columns.push({
            id: column.colIndex.slice(3),  // extracts '10' from 'col10'
            field: column.field,           // the name like 'sum_pass_att'
            filters: filters               // the filter array created above [{field: year, values: ['2020']}, {field: ...}]
        })
        // append the 'having' portion
        if (column.having && typeof(column.having) !== 'undefined') {
            output.having.push({id: column.colIndex.slice(3), value: column.having})
        }
    })
    // push the required years and stat type filters
    const years = Array.from(new Set(body.columns.map(column => column.filtersOther.year)))
    output.where.push({field: 'year', values: years})
    output.where.push({field: 'stat_type', values: statTypes})
    // sort the columns by id
    output.columns.sort((a, b) => a.id - b.id)
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