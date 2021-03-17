import React from "react";
import {Collapse, Form, Input, Button, Radio, Slider, Modal} from 'antd';
import {buildRequestBody, makeRequest} from "./submit-functions";

const {Panel} = Collapse;

export default function RowForm(props) {
    const [form] = Form.useForm()

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
    const buttonLayout = {
        wrapperCol: {
            offset: 10,
            span: 14,
        },
    };

    function onValuesChange(e) {
        props.setGlobalForm(prior => ({
            ...prior,
            row: form.getFieldsValue()
        }))
    }

    const formProps = {
        ...topLayout,
        name: "basic",
        form: form,
        onValuesChange: onValuesChange,
        initialValues: {
            field: 'player_name'
        }
    }


    return (
        <Form {...formProps}>

            <Form.Item label="Row Type" name="field">
                <Radio.Group>
                    <Radio value="player_name">By Player</Radio>
                    <Radio value="team_name">By Team</Radio>
                </Radio.Group>
            </Form.Item>

        </Form>
    );
};
