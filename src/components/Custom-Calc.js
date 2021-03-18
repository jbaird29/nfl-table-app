import React, {useEffect, useState} from "react";
import {Collapse, Form, Input, Button, Radio, Slider, Modal, Select, InputNumber, Divider, message} from 'antd';
import {addRender, addSorter, buildRequestBody, makeRequest} from './submit-functions'
import CustomCalcTabs from './Custom-Calc-Tabs'
const { Option, OptGroup } = Select;
const {Panel} = Collapse;


export default function CustomCalc(props) {
    const [customCalcs, setCustomCalcs] = useState([]);

    const modalProps = {
        title: "Edit Custom Calculations",
        visible: props.isVisible,
        onOk: onSubmit,
        onCancel: () => props.setVisible(false),
        width: 750,
        style: {top: 150}
    }

    function onSubmit () {
        const hide = message.loading({content: 'Loading the data', style: {fontSize: '1rem'}}, 0)
        // remove the custom calcs from table data
        props.setTableData(prev => {
            const newColumns = prev.columns.filter(column => !column.title.startsWith('Calculation'))
            const newDataSource = prev.dataSource.map(prior => (
                Object.assign(...Object.keys(prior)
                .filter(key => !key.startsWith('calc'))
                .map(key => ({[key]: prior[key]})) )))
            return {columns: newColumns, dataSource: newDataSource}
        })
        // add the custom calcs to table data
        customCalcs.sort((a, b) => a.calcIndex.slice(4) - b.calcIndex.slice(4)).forEach(customCalc => {
            addTableCalc(customCalc)
        })
        props.setVisible(false)
        hide()
        // form.resetFields();
        // console.log(customCalcs)
    }

    function addTableCalc(body) {
        const {calcIndex, colIndex1, operation, colIndex2, format, title} = body
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
        function addDataSource(prevDataSource) {
            const newDataSource = (operation === '/' ? prevDataSource[colIndex1] / prevDataSource[colIndex2] :
                                   operation === '*' ? prevDataSource[colIndex1] * prevDataSource[colIndex2] :
                                   operation === '+' ? prevDataSource[colIndex1] + prevDataSource[colIndex2] :
                                   operation === '-' ? prevDataSource[colIndex1] - prevDataSource[colIndex2] :
                                   null)
            return {...prevDataSource, [newColumnIndex]: newDataSource}
        }
        props.setTableData(prev => {
            const newColumns = [...prev.columns, newColumn]
            const newDataSource = prev.dataSource.map(addDataSource)
            return {columns: newColumns, dataSource: newDataSource}
        })
    }


    return (<>
        <>
        <Modal {...modalProps}>
            {props.tableData.columns && props.tableData.columns.length > 0 ?
            <CustomCalcTabs setCustomCalcs={setCustomCalcs} tableData={props.tableData} />
            : <p>Please select fields first</p>}
        </Modal>
        </>
    </>);
};
