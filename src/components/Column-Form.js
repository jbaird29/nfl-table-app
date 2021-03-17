import React, {useEffect, useState} from "react";
import {Collapse, Form, Input, Button, Radio, Slider, Modal, Select, InputNumber} from 'antd';
import statsInputs from './inputs/statsInputs.json'
import ColumnFormFilters from './Column-Form-Filters'
const { Option, OptGroup } = Select;
const {Panel} = Collapse;



export default function ColumnForm(props) {
    const [form] = Form.useForm()
    const [statType, setStatType] = useState()

    function onValuesChange(e) {
        const colName = `col${props.index}`
        props.setGlobalForm(prior => ({
            ...prior,
            [colName]: form.getFieldsValue()
        }))
    }

    const topLayout = {
        labelCol: {
            span: 10,
        },
        wrapperCol: {
            span: 14,
        },
        labelAlign: 'left',
        colon: false
    };

    const formProps = {
        ...topLayout,
        // name: "basic",
        form: form,
        onValuesChange: onValuesChange,
        initialValues: {
            // field: "sum_yds_pass",
            // filters: { year: '2020' }
        }
    }

    const onSelect = (value) => {
        if (value.includes('pass')) { setStatType('pass') }
        else if (value.includes('rush')) { setStatType('rush') }
        else if (value.includes('recv')) { setStatType('recv') }
    }

    const selectProps = {
        placeholder: "Please select",
        align: 'center',
        allowClear: true,
        showSearch: true,
        optionFilterProp: "label",
        maxTagCount: 'responsive',
        onSelect: onSelect,
        options: statsInputs
    }
    const yearProps = {
        placeholder: "Please select",
        align: 'center',
        allowClear: true,
        maxTagCount: 'responsive',
        options: [{value: '2020'}, {value: '2019'}, {value: '2018'}, {value: '2017'}, {value: '2016'}]
    }

    return (
        <Form {...formProps}>
            <Form.Item name='field' label="Select Stat Type">
                <Select {...selectProps}/>
            </Form.Item>
            
            <Form.Item name={['filtersOther', 'year']} label="Select Year">
                <Select {...yearProps}/>
            </Form.Item>

            <ColumnFormFilters />           
        </Form>
    );
};
