import React, {useState, useEffect} from "react";
import {Form, Slider, Select, InputNumber, Divider, Input, Button, Row, Col} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import statsInputs from '../../inputs/statsInputs.json'
import filtersStats from '../../inputs/filtersStats.json'
import filtersGeneral from '../../inputs/filtersGeneral.json'


export default function ColumnForm(props) {

    const selectProps = {
        placeholder: "Stat Type",
        align: 'center',
        showSearch: true,
        optionFilterProp: "label",
        maxTagCount: 'responsive',
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

    // this function will render the filtersStats based on what field is selected by the user
    // Example: the filter pass_incompletion_type should not be displayed if {field: 'pass_yards_sum'},
    //    because there are no pass yards in incompletion (i.e. pass_yards_sum would always equal 0)
    const renderFilters = (filters) => (
        filters.map(filter => (
            <Form.Item noStyle key={`wrapper_${filter.formProps.name}`} shouldUpdate={(prevValues, currentValues) =>
                (!currentValues[props.colIndex] || !prevValues[props.colIndex] || 
                !currentValues[props.colIndex].field || !prevValues[props.colIndex].field ) ? true :
                (prevValues[props.colIndex].field !== currentValues[props.colIndex].field)}
            >
            { ({getFieldValue}) => {
                const field = getFieldValue( [props.colIndex, 'field'])   // pass_yards_sum || undefined

                const statType = !field ? null : 
                                (field.includes('pass') ? 'pass' :
                                field.includes('rush') ? 'rush' :
                                field.includes('recv') ? 'recv' : null)  // pass || null

                const showFilter = !field ? false : 
                                   (filter.linkedAggs ? filter.linkedAggs.includes(field) : filter.statType === statType)
                                   // if no field selected: false; 
                                   // else if filter has linkedAggs: if field is in linkedAggs; 
                                   // else: if filter's stat type matches field's stat type
                
                return (showFilter ? <Form.Item {...filter.formProps} name={[props.colIndex, ...filter.formProps.name]} key={filter.formProps.name}>
                    {filter.ui.type === 'select' ? <Select {...filter.ui.props} /> : 
                        filter.ui.type === 'slider' ? <Slider {...filter.ui.props} /> : 
                        filter.ui.type === 'inputNumber' ? <InputNumber {...filter.ui.props} /> : null
                        }
                    </Form.Item>
                 : null)
            } }
            </Form.Item>
        ))
    )

    return (
    <>
            {/* <Button onClick={() => {form.resetFields(); onValuesChange(null, form.getFieldsValue()) }}>Reset</Button>
            
            <Button type="danger" onClick={() => {console.log(form.getFieldsValue())}}>Debug: Form</Button> */}

            <Form.Item name={[props.colIndex, 'title']} label='Enter a Column Title'
                tooltip={{ title: 'This title will appear in the table above this column. If no title is entred, it will be titled based on the Stat Type & Year.', 
                icon: <InfoCircleOutlined /> }}>
                <Input autoComplete="off" placeholder="Title (Optional)" style={{textAlign: "center"}} />
            </Form.Item>

            <Form.Item required name={[props.colIndex, 'field']} label="Select Stat Type"
                        rules={[{ required: true, message: 'Please select a stat type.', }, ]}
            >
                <Select {...selectProps}/>
            </Form.Item>
            
            <Form.Item required name={[props.colIndex, 'filters_general', 'season_year']} label="Select Year"
                        rules={[ { required: true, message: 'Please select a year.', }, ]}
            >
                <Select {...yearProps}/>
            </Form.Item>
        

            <Row gutter={24}>

            <Col span={12}>
            <Divider orientation="center" plain>General Filters (Optional)</Divider>

            <Form.Item name={[props.colIndex, 'having']} label="Minimum Value" 
                tooltip={{ title: 'Example: if you selected "Pass Attempts" as the Stat Type, entering 100 in this box would filter to rows with at least 100 pass attempts', 
                icon: <InfoCircleOutlined /> }}>
                <InputNumber {...minInputProps}/>
            </Form.Item>

            {filtersGeneral.map(filter => (
                <Form.Item {...filter.formProps} name={[props.colIndex, ...filter.formProps.name]}>
                {filter.ui.type === 'select' ? <Select {...filter.ui.props} /> : 
                    filter.ui.type === 'slider' ? <Slider {...filter.ui.props} /> : 
                    filter.ui.type === 'inputNumber' ? <InputNumber {...filter.ui.props} /> : null
                    }
                </Form.Item>
            ))}
            </Col>
            
            <Col span={12}>
            <Divider orientation="center" plain>Stat-Specific Filters (Optional)</Divider>
            
            {renderFilters(filtersStats)}

            </Col>
            
            </Row>
    </>
    );
};
