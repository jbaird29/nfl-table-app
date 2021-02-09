import React, {useState, useEffect} from "react";
import {Row, Col, Select, Divider} from 'antd';
import 'antd/dist/antd.css';

function SelectStats(props) {
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

    function handlePassChange(value) {props.setPassStats(value);}

    function handleRushChange(value) {props.setRushStats(value);}

    function handleRecvChange(value) {props.setRecvStats(value);}


    const selectProps = {
        placeholder: "Please select",
        align: 'center',
        mode: "multiple",
        allowClear: true,
        optionFilterProp: "label",
        maxTagCount: 'responsive',
        style: {width: '100%'}
    }

    return (
        // <div style={{textAlign: 'right'}}>
        <>
            <Row align='middle'>
                <Col span={6} style={{textAlign: 'left'}}>
                    <label>Passing</label>
                </Col>
                <Col span={18}>
                    <Select {...selectProps} onChange={handlePassChange} options={passOptions}/>
                </Col>
            </Row>
            <Divider dashed style={{margin: '5px 0px'}}/>
            <Row align='middle'>
                <Col span={6} style={{textAlign: 'left'}}>
                    <label>Rushing</label>
                </Col>
                <Col span={18}>
                    <Select {...selectProps} onChange={handleRushChange} options={rushOptions}/>
                </Col>
            </Row>
            <Divider dashed style={{margin: '5px 0px'}}/>
            <Row align='middle'>
                <Col span={6} style={{textAlign: 'left'}}>
                    <label style={{textAlign: 'left'}}>Receiving</label>
                </Col>
                <Col span={18}>
                    <Select {...selectProps} onChange={handleRecvChange} options={recvOptions}/>
                </Col>
            </Row>
        </>
        // </div>
    )
}

export default SelectStats