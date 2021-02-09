import React, {useState} from "react";
import {Row, Col, InputNumber} from 'antd';


function FilterReceptions(props) {

    function handleChange(value) {
        props.setMinReceptions(prevValue => value ? value : null);
    }

    return (
        <>
            <Row align='middle'>
                <Col span={18} style={{textAlign: 'left'}}>
                    <label>Minimum Receptions</label>
                </Col>
                <Col span={6} style={{textAlign: 'right'}}>
                    <InputNumber disabled={props.disabled} min={0} onChange={handleChange}/>
                </Col>
            </Row>
        </>
    )
}

export default FilterReceptions