import React, {useState} from "react";
import {Row, Col, Select} from 'antd';

const { Option } = Select;


function FilterInside20(props) {

    function handleChange(value) {
        props.setInside20(prevValue => value !== 'either' ? value : null);
    }

    return (
        <>
            <Row align='middle'>
                <Col span={12} style={{textAlign: 'left'}}>
                    <label>Inside 20 Yard Line?</label>
                </Col>
                <Col span={12} style={{textAlign: 'right'}}>
                    <Select defaultValue="either"  onChange={handleChange}>
                        <Option value="either">Either</Option>
                        <Option value="1">Inside</Option>
                        <Option value="0">Outside</Option>
                    </Select>
                </Col>
            </Row>
        </>
    )
}

export default FilterInside20