import React from "react";
import {Form, Slider, Select, InputNumber, Divider, Input, Row, Col, } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import statsInputs from '../../inputs/statsInputs.json'
import filtersStats from '../../inputs/filtersStats.json'
import filtersGeneral from '../../inputs/filtersGeneral.json'
import teamList from '../../inputs/teamList.json'
import playerList from '../../inputs/playerList.json'
import {renderFilterObject} from './render-filter'

const yearsList = [{value: '2020'}, {value: '2019'}, {value: '2018'}, {value: '2017'}, {value: '2016'}]

export default function ColumnForm(props) {

    const selectProps = {
        placeholder: "Stat Type",
        align: 'center',
        showSearch: true,
        optionFilterProp: "label",
        maxTagCount: 'responsive',
        options: statsInputs
    }

    // renderFilterObject takes filter, name, key as parameters
    const renderColFilterObject = (filter) => (
        renderFilterObject(filter, ['columns', props.colIndex, 'filters', filter.name], `${props.colIndex}_${filter.name}`)    
    )

    // this function will render the filtersStats based on what field is selected by the user
    // Example: the filter pass_incompletion_type should not be displayed if {field: 'pass_yards_sum'},
    //    because there are no pass yards in incompletion (i.e. pass_yards_sum would always equal 0)
    const renderStatTypeFilter = (filter) => (
        <Form.Item noStyle key={`wrapper_${props.colIndex}_${filter.name}`} shouldUpdate={(prev, current) =>
            (!current.columns || !prev.columns || 
            !current.columns[props.colIndex] || !prev.columns[props.colIndex] || 
            !current.columns[props.colIndex].field || !prev.columns[props.colIndex].field ) ? true :
            (current.columns[props.colIndex].field !== prev.columns[props.colIndex].field)}
        >
        { ({getFieldValue}) => {
            const field = getFieldValue(['columns', props.colIndex, 'field'])   // pass_yards_sum || undefined
            const statType = !field ? null : field.slice(0, 4)                  // pass || null
            const showFilter = !field ? false : 
                                (filter.linkedAggs ? filter.linkedAggs.includes(field) : filter.statType === statType)
                                // if no field selected: false; 
                                // else if filter has linkedAggs: show if field is in linkedAggs; 
                                // else: if filter's stat type matches field's stat type
            return (showFilter ? renderColFilterObject(filter) : null)
        } }
        </Form.Item>
    )

    const renderRowTypeFilter = (fieldName, fieldLabel, fieldOptions) => (
        <Form.Item noStyle shouldUpdate={(prev, current) =>
            (!current.row || !prev.row) ? true :
            (current.row.field !== prev.row.field)}>
            {({ getFieldValue }) =>
                getFieldValue(['row', 'field']) !== fieldName ? (
                <Form.Item name={['columns', props.colIndex, 'filters', fieldName]} label={`Select ${fieldLabel}`}
                    labelCol={{span: 16}} wrapperCol={{span: 8}} >
                    <Select showSearch={true} allowClear={true} placeholder={fieldLabel} options={fieldOptions}/>
                </Form.Item>
                ) : null
            }
        </Form.Item>
    )

    return (
    <>

            <Form.Item name={['columns', props.colIndex, 'title']} label='Enter a Column Title'
                tooltip={{ title: 'This title will appear in the table above this column. If no title is entred, it will be titled based on the Stat Type.', 
                icon: <InfoCircleOutlined /> }}>
                <Input autoComplete="off" placeholder="Title (Optional)" style={{textAlign: "center"}} />
            </Form.Item>

            <Form.Item required name={['columns', props.colIndex, 'field']} label="Select Stat Type"
                        rules={[{ required: true, message: 'Please select a stat type.', }, ]} >
                <Select {...selectProps}/>
            </Form.Item>

            <Divider orientation="center" plain>Recommended Filters</Divider>

            {renderRowTypeFilter('season_year', 'Year', yearsList)}
            {renderRowTypeFilter('team_name', 'Team', teamList)}
            {renderRowTypeFilter('player_name_with_position', 'Player', playerList)}

            <Divider orientation="center" plain>General Filters (Optional)</Divider>

            <Form.Item name={['columns', props.colIndex, 'having']} label="Minimum Value" 
                tooltip={{ title: 'Example: if you selected "Pass Attempts" as the Stat Type, entering 100 in this box would filter to rows with at least 100 pass attempts', 
                icon: <InfoCircleOutlined /> }}>
                <InputNumber style={{width: '50%', marginLeft: '50%'}}/>
            </Form.Item>

            {filtersGeneral.map(filter => renderColFilterObject(filter) )}

            <Divider orientation="center" plain>Stat-Specific Filters (Optional)</Divider>
            {filtersStats.map(filter => renderStatTypeFilter(filter))}

    </>
    );
};
