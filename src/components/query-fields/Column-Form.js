import React, {useState} from "react";
import {Form, Slider, Select, InputNumber, Divider, Input} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import statsInputs from '../../inputs/statsInputs.json'
import filtersPass from '../../inputs/filtersPass.json'
import filtersRush from '../../inputs/filtersRush.json'
import filtersRecv from '../../inputs/filtersRecv.json'


export default function ColumnForm(props) {
    const [form] = Form.useForm()
    const [statType, setStatType] = useState()

    function onValuesChange() {
        const colIndex = `col${props.index}`
        props.setQueryFields(prior => ({
            ...prior,
            columns: [...prior.columns.filter(column => column.colIndex !== colIndex), {colIndex: colIndex, ...form.getFieldsValue()}],
        }))
    }

    const topLayout = {
        labelCol: { span: 10, },
        wrapperCol: { span: 14, },
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
            // filters: { season_year: '2020' }
        }
    }

    const onSelect = (value) => {
        if (value.includes('pass'))      { setStatType('pass'); form.resetFields(['filtersRush']); form.resetFields(['filtersRecv']) }
        else if (value.includes('rush')) { setStatType('rush'); form.resetFields(['filtersPass']); form.resetFields(['filtersRecv']) }
        else if (value.includes('recv')) { setStatType('recv'); form.resetFields(['filtersPass']); form.resetFields(['filtersRush']) }
        const colIndex = `col${props.index}`
        props.setQueryFields(prior => ({
            ...prior,
            columns: [...prior.columns.filter(column => column.colIndex !== colIndex), {colIndex: colIndex, ...form.getFieldsValue()}],
        }))
    }

    const selectProps = {
        placeholder: "Please select",
        align: 'center',
        showSearch: true,
        optionFilterProp: "label",
        maxTagCount: 'responsive',
        onSelect: onSelect,
        options: statsInputs
    }

    const yearProps = {
        placeholder: "Please select",
        align: 'center',
        maxTagCount: 'responsive',
        style: {width: '50%', marginLeft: '50%'},
        options: [{value: '2020'}, {value: '2019'}, {value: '2018'}, {value: '2017'}, {value: '2016'}]
    }

    const minInputProps = {
        style: {width: '50%', marginLeft: '50%'}
    }


    return (
        <Form {...formProps}>
            <Form.Item name='title' label='Enter a Column Title'
                tooltip={{ title: 'This title will appear in the table above this column. If no title is entred, it will be titled based on the Stat Type & Year.', 
                icon: <InfoCircleOutlined /> }}>
                <Input autoComplete="off" placeholder="Title (Optional)" style={{textAlign: "center"}} />
            </Form.Item>

            <Form.Item required name='field' label="Select Stat Type">
                <Select {...selectProps}/>
            </Form.Item>
            
            <Form.Item required name={['filtersOther', 'season_year']} label="Select Year">
                <Select {...yearProps}/>
            </Form.Item>

            <Divider orientation="center" plain>General Filters (Optional)</Divider>

            <Form.Item name='having' label="Minimum Value" 
                tooltip={{ title: 'E.g. if you selected "Pass Attempts" as the Stat Type, entering "100" in this box would filter to rows with at least 100 pass attempts', 
                icon: <InfoCircleOutlined /> }}>
                <InputNumber {...minInputProps}/>
            </Form.Item>

            <Divider orientation="center" plain>Stat-Specific Filters (Optional)</Divider>
            {!statType && <p>No stat type selected</p>}
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
