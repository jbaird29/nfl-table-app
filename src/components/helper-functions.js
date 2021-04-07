import teamList from '../inputs/teamList.json'
import playerList from '../inputs/playerList.json'
import { Typography, Tooltip, } from 'antd';
const { Text, Link } = Typography;


// converts: [{value: gsis_id_1, label: player_name_1}] 
// into:     {player_name_1: gsis_id_1, player_name_2: gsis_id_2}
const playerMap = Object.assign( ...playerList.map(props => ({[props.label]: props.value })) )
const teamMap = Object.assign( ...teamList.map(props => ({[props.label]: props.value })) )

export const listOfRowTypes = ['season_year', 'player_name_with_position', 'team_name']

export const yearsList = [{label: '2020', value: '2020'}, {label: '2019', value: '2019'}, 
    {label: '2018', value: '2018'}, {label: '2017', value: '2017'}, {label: '2016', value: '2016'},
    {label: '2015', value: '2015'}, {label: '2014', value: '2014'}, {label: '2013', value: '2013'}, 
    {label: '2012', value: '2012'}]


/**
 * Given a TableProps column object, adds a sorter function depending on format type
 * @param {Object} column - tableProps Column
 */
export function addSorter(column, tableInfo) {
    const columnName = column.dataIndex
    if (column.dataType === 'number') {
        column.sorter = (a, b) => a[columnName] - b[columnName]
    } else if (column.dataType === 'string') {
        column.sorter = (a, b) => (a[columnName].toUpperCase() < b[columnName].toUpperCase() ? -1 : 1)
    }
    // potentially make this column the default sort
    // https://ant.design/components/table/?theme=compact#components-table-demo-head
    const {sorter} = tableInfo
    const {field, order} = sorter
    if (columnName === field) {
        column.defaultSortOrder = order
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
    } else if (column.format === 'string' && column.dataIndex === 'player_name_with_position') {
        // if player is not in playerMap, just render the text
        column.render = (text, row, index) => ((!text || !playerMap[text]) ? text : <span> 
            <Tooltip title="View Player Stats" placement="bottom" mouseEnterDelay={0.08} mouseLeaveDelay={0} overlayStyle={{fontSize: '0.75rem'}} >
            <Link target="_blank" href={`/pages/players/${encodeURI(playerMap[text])}`}>{text}</Link></Tooltip></span>)
    } else if (column.format === 'string' && column.dataIndex === 'team_name') {
        column.render = (text, row, index) => ((!text || !teamMap[text]) ? text : <span> 
            <Tooltip title="View Team Stats" placement="bottom" mouseEnterDelay={0.08} mouseLeaveDelay={0} overlayStyle={{fontSize: '0.75rem'}} >
            <Link target="_blank" href={`/pages/teams/${encodeURI(teamMap[text])}`}>{text}</Link></Tooltip></span>)
    }
}


/**
 * Given a tableData object, adds render and sorter functions to each of the columns
 * @param {Object} tableData 
 */
export function addRenderSorterToTable(tableData, tableInfo) {
    tableData.columns.forEach(column => {
        if ('children' in column) {
            column.children.forEach(child => {
                addSorter(child, tableInfo);
                addRender(child);
            })
        } else {
            addSorter(column, tableInfo);
            addRender(column);
        }
    })
    return tableData
}


/**
 * Given a calcIndex and customCalc Object, creates the 'column' entry for tableProps
 * @param {*} calcIndex 
 * @param {*} customCalc 
 * @returns tableData.columns object
 */
export function buildTableCalcColumn(calcIndex, calc) {
    const {colIndex1, operation, colIndex2, format, title} = calc
    const newColumn = {
        title: `Calc ${calcIndex.slice(4)}`,  // extracts '10' from 'calc10'
        align: 'center',
        children: [{
            dataIndex: calcIndex, 
            columnKey: calcIndex,
            title: title,
            align: "right",
            width: "75px",
            className: 'custom-calc',
            format: format,
            dataType: 'number'
        }]
    }
    // addRender(newColumn.children[0], tableProps)
    // addSorter(newColumn.children[0])
    return newColumn
}


/**
 * Given a customCalc (Object) and the row of values (Object), performs the calculation
 * @param {*} customCalc 
 * @param {*} prevDataSource 
 * @returns number
 */
export function performCustomCalc(calc, row) {
    const {colIndex1, operation, colIndex2, format, title} = calc
    return (operation === '/' ? row[colIndex1] / row[colIndex2] :
                            operation === '*' ? row[colIndex1] * row[colIndex2] :
                            operation === '+' ? row[colIndex1] + row[colIndex2] :
                            operation === '-' ? row[colIndex1] - row[colIndex2] :
                            null)
}

/**
 * Given a tableData object and calcFields object, adds the calcFields to the tableData
 * @param {*} tableData 
 * @param {*} calcsFields
 */
export function addCalcsToTable(tableData, calcsFields) {
    Object.entries(calcsFields)
    .sort((a, b) => a[0].slice(4) - b[0].slice(4))   // sort based on the number in calcIndex (e.g. calc1 before calc2)
    .forEach(([calcIndex, calc]) => {
        tableData.columns.push(buildTableCalcColumn(calcIndex, calc))
        tableData.dataSource.forEach(row => row[calcIndex] = performCustomCalc(calc, row))
    })
    return tableData
}

/**
 * Given a tableData object, returns a NEW COPY of the tableData without custom calculations
 * @param {Object} tableData 
 * @returns tableData
 */
export function copyTableWithoutCalcs(tableData) {
    const newColumns = tableData.columns.filter(column => !column.title.startsWith('Calc'))
    const newDataSource = tableData.dataSource.map(row => (
        Object.assign(...Object.keys(row)
        .filter(key => !key.startsWith('calc'))
        .map(key => ({[key]: row[key]})) )))
    return {columns: newColumns, dataSource: newDataSource}   
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