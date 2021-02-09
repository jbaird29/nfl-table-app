import React, {useState} from "react";
import {Row, Col, InputNumber} from 'antd';


function FilterRushAtt(props) {

    function handleChange(value) {
        props.setMinRushAtt(prevValue => value ? value : null);
    }

    return (
        <>
            <Row align='middle'>
                <Col span={18} style={{textAlign: 'left'}}>
                    <label>Minimum Rush Attempts</label>
                </Col>
                <Col span={6} style={{textAlign: 'right'}}>
                    <InputNumber disabled={props.disabled} min={0} onChange={handleChange}/>
                </Col>
            </Row>
        </>
    )
}

export default FilterRushAtt