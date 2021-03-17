import React, {useEffect, useState} from "react";
import {Collapse, Form, Input, Button, Radio, Slider, Modal, Select, InputNumber, Divider} from 'antd';
import statsInputs from './inputs/statsInputs.json'
import filtersPass from './inputs/filtersPass.json'
import ColumnFormFilters from './Column-Form-Filters'
const { Option, OptGroup } = Select;
const {Panel} = Collapse;



export default function ColumnForm(props) {
    const [form] = Form.useForm()
    const [statType, setStatType] = useState()
    // const [filtersPass, setFiltersPass] = useState([])

    // useEffect(() => {
    //     setFiltersPass(filtersPassData)
    // }, []);


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
        if (value.includes('pass'))      { setStatType('pass'); form.resetFields(['filtersRush']); form.resetFields(['filtersRecv']) }
        else if (value.includes('rush')) { setStatType('rush'); form.resetFields(['filtersPass']); form.resetFields(['filtersRecv']) }
        else if (value.includes('recv')) { setStatType('recv'); form.resetFields(['filtersPass']); form.resetFields(['filtersRush']) }
        const colName = `col${props.index}`
        props.setGlobalForm(prior => ({ ...prior, [colName]: form.getFieldsValue() }))
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

            <Divider orientation="center" plain>General Filters</Divider>
            
            <Divider orientation="center" plain>Stat-Specific Filters</Divider>
            {statType === 'pass' && <Form.List name="filtersPass">
                {() => (
                    <div>
                    {filtersPass.map(filter => (
                        <Form.Item {...filter.formProps} fieldKey={[filter.formProps.name]}>
                            {filter.ui.type === 'select' ? <Select {...filter.ui.props} /> : 
                            filter.ui.type === 'slider' ? <Slider {...filter.ui.props} /> : 
                            filter.ui.type === 'inputNumber' ? <InputNumber {...filter.ui.props} /> : null
                            }
                        </Form.Item>                        
                    ))}
                    </div>
                )}
                </Form.List>}

        </Form>
    );
};
