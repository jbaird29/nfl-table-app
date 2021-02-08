import React, {useState} from "react";
import {Row, Col, InputNumber} from 'antd';


function FilterPassAtt(props) {

    function handleChange(value) {
        props.setMinPassAtt(prevValue => value ? value : null);
    }

    return (
        <>
            <Row align='middle'>
                <Col span={18} style={{textAlign: 'left'}}>
                    <label>Minimum Pass Attempts</label>
                </Col>
                <Col span={6} style={{textAlign: 'right'}}>
                    <InputNumber id='minPassAtt' min={0} onChange={handleChange}/>
                </Col>
            </Row>
        </>
    )
}

export default FilterPassAtt