import React, {useState} from "react";
import {Form, InputNumber} from 'antd';


export default function RecvFilters(props) {

    return (
        <>
            <Form.Item name={['having', 'sum_rec_recv']} label="Minimum Receptions">
                <InputNumber min={0} />
            </Form.Item>
        </>
    )
}