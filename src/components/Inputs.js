import React from "react";
import {Collapse, Form, Input, Button, Radio, Slider, Modal} from 'antd';
import Stats from "./Stats";
import PassFilters from "./Filters-Pass";
import RushFilters from "./Filters-Rush";
import RecvFilters from "./Filters-Recv";
import GlobalFilters from "./Filters-Global";
import {buildRequestBody, makeRequest} from "./submit-functions";

const {Panel} = Collapse;

export default function Inputs(props) {
    const [form] = Form.useForm()

    async function onFinish(values) {
        // if there are no pass, rush, or recv stats selected, throw an error to user
        if (!values.stats.pass && !values.stats.rush && !values.stats.recv) {
            Modal.error({title: 'Please select at least one stat', content: 'Either passing, rushing, or receiving',});
            return
        }
        const body = buildRequestBody(values)
        console.log(body)
        const tableData = await makeRequest(body)
        props.setTableData(tableData)
    };

    function onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    };

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

    const yearSliderProps = {
        range: true,
        max: 2020,
        min: 2016,
        marks: {2016: '2016', 2020: '2020'},
        included: true,
        style: {margin: '0 25px'}
    }

    const formProps = {
        ...topLayout,
        name: "basic",
        form: form,
        onFinish: onFinish,
        onFinishFailed: onFinishFailed,
        initialValues: {
            row: 'player_name',
            years: [2020, 2020]
        }
    }


    return (
        <Form {...formProps}>

            <Form.Item {...buttonLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>

            <Form.Item label="Row Type" name="row">
                <Radio.Group>
                    <Radio value="player_name">By Player</Radio>
                    <Radio value="team_name">By Team</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item label="Select Years" name="years">
                <Slider {...yearSliderProps} />
            </Form.Item>

            <Stats/>

            <Collapse className="site-collapse-custom-collapse">
                <Panel header="Select Global Filters" key="1" className="site-collapse-custom-panel">
                    <GlobalFilters/>
                </Panel>

                <Panel header="Select Pass Filters" key="2" className="site-collapse-custom-panel">
                    <PassFilters />
                </Panel>
                <Panel header="Select Rush Filters" key="3" className="site-collapse-custom-panel">
                    <RushFilters/>
                </Panel>
                <Panel header="Select Receiving Filters" key="4" className="site-collapse-custom-panel">
                    <RecvFilters/>
                </Panel>

            </Collapse>

        </Form>
    );
};
