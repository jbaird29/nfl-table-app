import React, {useState, useEffect} from "react";
import {Form, Slider, Select, InputNumber, Divider, Input, Button} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import statsInputs from '../../inputs/statsInputs.json'
import filtersPass from '../../inputs/filtersPass.json'
import filtersRush from '../../inputs/filtersRush.json'
import filtersRecv from '../../inputs/filtersRecv.json'
import filtersStats from '../../inputs/filtersStats.json'


export default function ColumnForm(props) {
    const [form] = Form.useForm()
    const [shownFilters, setShownFilters] = useState([])

    function onValuesChange(changedValues, allValues) {
        const colIndex = `col${props.index}`
        props.setQueryFields(prior => ({
            ...prior,
            columns: [...prior.columns.filter(column => column.colIndex !== colIndex), {colIndex: colIndex, ...allValues}],
        }))
        return true
    }

    // this Effect ensure that after shownFilters changes, the global form state (setQueryFields) is updated
    // Example: the user has selected {field: 'pass_attempts_sum', pass_incompletion_type: 'Poorly Thrown'}.
    //    The user then selects {field: 'pass_yards_sum'} and pass_incompletion_type is removed from shownFilters.
    //    In that case, the global queryFields needs to be updated to remove pass_incompletion_type values. This removal
    //    was not handled by onValuesChange() because technically, no value changed (it was just a rerendering of the DOM)
    useEffect(() => {
        onValuesChange(null, form.getFieldsValue())
      }, [shownFilters]);


    // this function re-renders the filtersStats based on what field is selected by the user
    // Example: the filter pass_incompletion_type should not be displayed if {field: 'pass_yards_sum'},
    //    because there are no pass yards in incompletion (i.e. pass_yards_sum would always equal 0)
    function onSelect(value) {
        const statType = value.includes('pass') ? 'pass' :
                         value.includes('rush') ? 'rush' :
                         value.includes('recv') ? 'recv' : null
        const newShownFilters = filtersStats.filter(fltr => fltr.linkedAggs ? fltr.linkedAggs.includes(value) : fltr.statType === statType)
        setShownFilters(newShownFilters)
    }

    const topLayout = {
        labelCol: { span: 10, },
        wrapperCol: { span: 14, },
        labelAlign: 'left',
        colon: false
    };

    const formProps = {
        ...topLayout,
        form: form,
        onValuesChange: onValuesChange,
        initialValues: {
            // field: "sum_yds_pass",
            // filters: { season_year: '2020' }
        }
    }

    const selectProps = {
        placeholder: "Stat Type",
        align: 'center',
        showSearch: true,
        optionFilterProp: "label",
        maxTagCount: 'responsive',
        onSelect: onSelect,
        options: statsInputs
    }

    const yearProps = {
        placeholder: "Year",
        align: 'center',
        maxTagCount: 'responsive',
        style: {width: '50%', marginLeft: '50%'},
        options: [{value: '2020'}, {value: '2019'}, {value: '2018'}, {value: '2017'}, {value: '2016'}]
    }

    const minInputProps = {
        style: {width: '50%', marginLeft: '50%'}
    }

    return (
    <>
        <Form {...formProps}>
            <Button type="danger" onClick={() => {console.log(form.getFieldsValue())}}>Debug: Form</Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
            <Form.Item name='title' label='Enter a Column Title'
                tooltip={{ title: 'This title will appear in the table above this column. If no title is entred, it will be titled based on the Stat Type & Year.', 
                icon: <InfoCircleOutlined /> }}>
                <Input autoComplete="off" placeholder="Title (Optional)" style={{textAlign: "center"}} />
            </Form.Item>

            <Form.Item required name='field' label="Select Stat Type">
                <Select {...selectProps}/>
            </Form.Item>
            
            <Form.Item required name={['filters_general', 'season_year']} label="Select Year">
                <Select {...yearProps}/>
            </Form.Item>

            <Divider orientation="center" plain>General Filters (Optional)</Divider>

            <Form.Item name='having' label="Minimum Value" 
                tooltip={{ title: 'E.g. if you selected "Pass Attempts" as the Stat Type, entering "100" in this box would filter to rows with at least 100 pass attempts', 
                icon: <InfoCircleOutlined /> }}>
                <InputNumber {...minInputProps}/>
            </Form.Item>

            <Divider orientation="center" plain>Stat-Specific Filters (Optional)</Divider>

            {shownFilters.map(filter => (
                <Form.Item {...filter.formProps}>
                {filter.ui.type === 'select' ? <Select {...filter.ui.props} /> : 
                    filter.ui.type === 'slider' ? <Slider {...filter.ui.props} /> : 
                    filter.ui.type === 'inputNumber' ? <InputNumber {...filter.ui.props} /> : null
                    }
                </Form.Item>
            ))}

        </Form>
    </>
    );
};
