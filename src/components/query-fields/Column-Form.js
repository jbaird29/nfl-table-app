import React from "react";
import {Form,  Select, InputNumber, Divider, Input, } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import statsInputs from '../../inputs/statsInputs.json'
import filtersStats from '../../inputs/filtersStats.json'
import filtersGeneral from '../../inputs/filtersGeneral.json'
import teamList from '../../inputs/teamList.json'
import playerList from '../../inputs/playerList.json'
import {renderFilterObject} from './render-filter'
import {yearsList} from '../helper-functions'

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

    const renderRowTypeFilter = (correspondingRow, fieldName, fieldLabel, fieldOptions, toolTipText) => (
        <Form.Item noStyle shouldUpdate={(prev, current) =>
            (!current.row || !prev.row) ? true :
            (current.row.field !== prev.row.field)}>
            {({ getFieldValue }) =>
                getFieldValue(['row', 'field']) !== correspondingRow ? (
                <Form.Item name={['columns', props.colIndex, 'filters', fieldName]} label={`Select ${fieldLabel}`}
                    labelCol={{span: 16}} wrapperCol={{span: 8}} 
                    tooltip={!toolTipText ? false : { title: toolTipText, icon: <InfoCircleOutlined /> }} >
                    <Select showSearch={true} allowClear={true} placeholder={fieldLabel} options={fieldOptions}  optionFilterProp="label"/>
                </Form.Item>
                ) : null
            }
        </Form.Item>
    )

    return (
    <>

            <Form.Item name={['columns', props.colIndex, 'title']} label='Enter a Column Title'
                tooltip={{ title: 'Optional. If no title is entered, it will be auto-generated based on the Stat Type.', 
                icon: <InfoCircleOutlined /> }}>
                <Input autoComplete="off" placeholder="Title (Optional)" style={{textAlign: "center"}} />
            </Form.Item>

            <Form.Item required name={['columns', props.colIndex, 'field']} label="Select Stat Type"
                        rules={[{ required: true, message: 'Please select a stat type.', }, ]} >
                <Select {...selectProps}/>
            </Form.Item>

            {renderRowTypeFilter('season_year', 'season_year', 'Year', yearsList, 'If no year is selected, the stats will display total career statistics.')}
            {renderRowTypeFilter('player_name_with_position', 'player_gsis_id', 'Player', playerList)}
            {renderRowTypeFilter('team_name', 'team_id', 'Team', teamList)}

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
