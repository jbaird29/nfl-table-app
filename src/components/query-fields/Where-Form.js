import React from "react";
import {Form, Select, Slider, InputNumber, Typography} from 'antd';
import filtersWhere from '../../inputs/filtersWhere.json'
import teamList from '../../inputs/teamList.json'
import playerList from '../../inputs/playerList.json'
import {renderFilterObject} from './render-filter'

const yearsList = [{value: '2020'}, {value: '2019'}, {value: '2018'}, {value: '2017'}, {value: '2016'}]

const {Title, Paragraph} = Typography

export default function WhereForm(props) {


    return (<>
            <Paragraph style={{textAlign: 'center'}}>Global filters are optional. These filters will be applied to ALL columns.</Paragraph>

            <Form.Item name={['where', 'season_year']} label={`Select Years`}
                labelCol={{span: 12}} wrapperCol={{span: 12}} >
                <Select mode="multiple" showSearch={true} allowClear={true} placeholder='Year' options={yearsList}/>
            </Form.Item>

            <Form.Item name={['where', 'team_id']} label={`Select Teams`}
                labelCol={{span: 12}} wrapperCol={{span: 12}} >
                <Select mode="multiple" showSearch={true} allowClear={true} placeholder='Team' options={teamList} optionFilterProp="label"/>
            </Form.Item>

            <Form.Item name={['where', 'player_gsis_id']} label={`Select Players`}
                labelCol={{span: 12}} wrapperCol={{span: 12}} >
                <Select mode="multiple" showSearch={true} allowClear={true} placeholder='Players' options={playerList} optionFilterProp="label"/>
            </Form.Item>

            {filtersWhere.map(filter => renderFilterObject(filter))}

        </>
    );
};
