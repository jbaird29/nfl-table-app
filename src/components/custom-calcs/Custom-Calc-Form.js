import React, {} from "react";
import {Form, Input, Select, } from 'antd';


export default function CustomCalcForm(props) {
    const [form] = Form.useForm()

    function onValuesChange() {
        const calcIndex = `calc${props.index}`
        const formData = {...form.getFieldsValue(), calcIndex: calcIndex}
        props.setCustomCalcs(prior => [...prior.filter(form => form.calcIndex !== calcIndex), formData])
    }
    // const exampleState = {
    //     calcIndex: 'calc1',
    //     colIndex1: 'col1',
    //     operation: '+',
    //     colIndex2: 'col2',
    //     format: 'number',
    //     title: 'Total Pass Yards 2019+2020'
    // }

    const formProps = {
        labelCol: { span: 14, },
        wrapperCol: { span: 10 },
        labelAlign: 'left',
        colon: false,
        form: form,
        onValuesChange: onValuesChange,
        initialValues: { }
    }

    const colsInTable = props.tableData.columns && props.tableData.columns.length > 0 ? 
                        props.tableData.columns.filter(column => column.title.startsWith('Column'))
                        .map(column => ({label: column.title, value: column.children[0].dataIndex}))
                        : null

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
        <Form {...formProps}>

            <Form.Item required name='colIndex1' label="Select First Column">
                <Select {...colSelectProps}/>
            </Form.Item>

            <Form.Item required name='operation' label="Select Operation type">
                <Select {...operationSelectProps}/>
            </Form.Item>

            <Form.Item required name='colIndex2' label="Select Second Column">
                <Select {...colSelectProps}/>
            </Form.Item>

            <Form.Item required name='format' label="Select Formatting Type">
                <Select {...formatSelectProps}/>
            </Form.Item>

            <Form.Item required name='title' label="Input a Name">
                <Input autoComplete="off" placeholder="column title" style={{textAlign: "center"}} />
            </Form.Item>

        </Form>
    </>);
};
