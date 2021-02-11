import React, {useState, useEffect} from "react";
import {Collapse, Form, Select, Divider} from 'antd';

const {Panel} = Collapse;


export default function Stats(props) {
    const [passOptions, setPassOptions] = useState([])
    const [rushOptions, setRushOptions] = useState([])
    const [recvOptions, setRecvOptions] = useState([])

    useEffect(() => {
        fetch(`http://localhost:9000/stats-inputs/pass`)
        .then(resp => resp.json()).then(data => setPassOptions(data))
    }, []);
    useEffect(() => {
        fetch(`http://localhost:9000/stats-inputs/rush`)
        .then(resp => resp.json()).then(data => setRushOptions(data))
    }, []);
    useEffect(() => {
        fetch(`http://localhost:9000/stats-inputs/receive`)
        .then(resp => resp.json()).then(data => setRecvOptions(data))
    }, []);

    const selectProps = {
        placeholder: "Please select",
        align: 'center',
        mode: "multiple",
        allowClear: true,
        optionFilterProp: "label",
        maxTagCount: 'responsive',
    }

    return (
        <>
            <Form.Item name={['stats', 'pass']} label="Passing Stats">
                <Select {...selectProps} options={passOptions}/>
            </Form.Item>
            {/*<Divider dashed style={{margin: '5px 0px'}}/>*/}
            <Form.Item name={['stats', 'rush']} label="Rushing Stats">
                <Select {...selectProps} options={rushOptions}/>
            </Form.Item>
            {/*<Divider dashed style={{margin: '5px 0px'}}/>*/}
            <Form.Item name={['stats', 'recv']} label="Receiving Stats">
                <Select {...selectProps} options={recvOptions}/>
            </Form.Item>
        </>
    )
}