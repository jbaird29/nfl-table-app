import React from "react";
import {Form, Radio, } from 'antd';


export default function RowForm(props) {

    return (

            <Form.Item label="Row Type (Display Stats by...)" name={['row', 'field']}
                        rules={[ { required: true, message: 'Please select a row type.', }, ]}
                        key="row_field"
            >
                <Radio.Group key="row_field_radio" >
                    <Radio value="player_name_with_position">By Player</Radio>
                    <Radio value="team_name">By Team</Radio>
                </Radio.Group>
            </Form.Item>

    );
};
