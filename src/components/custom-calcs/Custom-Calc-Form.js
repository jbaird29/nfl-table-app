import React, {} from "react";
import {Form, Input, Select, } from 'antd';


export default function CustomCalcForm(props) {

    // const exampleState = {
    //     calcIndex: 'calc1',
    //     colIndex1: 'col1',
    //     operation: '+',
    //     colIndex2: 'col2',
    //     format: 'number',
    //     title: 'Total Pass Yards 2019+2020'
    // }


    const colsInTable = props.tableData.columns && props.tableData.columns.length > 0 ? 
                        props.tableData.columns.filter(column => column.title.startsWith('Column'))
                        .map(column => ({label: `${column.title}: ${column.children[0].title}`, value: column.children[0].dataIndex}))
                        // only includes Calculations that have a lower CalcIndex than the current one;
                        // because Calculations are added sequentially to TableData; so later calcs can only draw from earlier ones
                        .concat(
                            Object.entries(props.calcsForm.getFieldsValue())
                            .filter(([calcIndex, calc]) => calcIndex.slice(4) < props.calcIndex.slice(4))
                            .sort((a, b) => a[0].slice(4) - b[0].slice(4)) 
                            .map(([calcIndex, calc]) => ({label: `Calculation ${calcIndex.slice(4)}: ${calc.title}`, value: calcIndex}))
                        )
                        : null
                        // this makes the label "Column 1: Pass Yards 2020, value: "col1"

    const colSelectProps = {
        placeholder: "column",
        align: 'center',
        options: colsInTable
    }

    const operationSelectProps = {
        placeholder: "operation",
        align: 'center',
        options: [{label: '(+) Add', value: '+'}, {label: '(-) Subtract', value: '-'},
                  {label: '(*) Mulitply', value: '*'}, {label: '(/) Divide', value: '/'}]
    }

    const formatSelectProps = {
        placeholder: "format",
        align: 'center',
        options: [{label: 'Number (0)', value: 'dec_0'}, {label: 'Number (0.0)', value: 'dec_1'}, 
                  {label: 'Number (0.00)', value: 'dec_2'}, {label: 'Percent (%)', value: 'percent'}]
    }

    return (<>

            <Form.Item required name={[props.calcIndex, 'colIndex1']} label="Select First Column">
                <Select {...colSelectProps}/>
            </Form.Item>

            <Form.Item required name={[props.calcIndex, 'operation']} label="Select Operation type">
                <Select {...operationSelectProps}/>
            </Form.Item>

            <Form.Item required name={[props.calcIndex, 'colIndex2']} label="Select Second Column">
                <Select {...colSelectProps}/>
            </Form.Item>

            <Form.Item required name={[props.calcIndex, 'format']} label="Select Formatting Type">
                <Select {...formatSelectProps}/>
            </Form.Item>

            <Form.Item required name={[props.calcIndex, 'title']} label="Input a Name">
                <Input autoComplete="off" placeholder="column title" style={{textAlign: "center"}} />
            </Form.Item>

    </>);
};
