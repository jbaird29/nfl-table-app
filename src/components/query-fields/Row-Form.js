import React from "react";
import {Form, Radio, Typography, } from 'antd';
const { Paragraph} = Typography


export default function RowForm(props) {

    return (<>
            <Paragraph style={{textAlign: 'center'}}>Row Type determines how the statistics are displayed.</Paragraph>
            <Form.Item label="Row Type" name={['row', 'field']}
                        rules={[ { required: true, message: 'Please select a row type.', }, ]}
                        key="row_field"
                        labelCol={{ span: 6, }}
                        wrapperCol={{ span: 18,  }}
            >
                <Radio.Group key="row_field_radio">
                    <Radio value="player_name_with_position">By Player</Radio>
                    <Radio value="team_name">By Team</Radio>
                    <Radio value="season_year">By Year</Radio>
                </Radio.Group>
            </Form.Item>

    </>);
};
