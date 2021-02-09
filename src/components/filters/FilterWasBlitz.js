import React, {useState} from "react";
import {Row, Col, Select} from 'antd';

const { Option } = Select;


function FilterWasBlitz(props) {

    function handleChange(value) {
        props.setWasBlitz(prevValue => value !== 'either' ? value : null);
    }

    return (
        <>
            <Row align='middle'>
                <Col span={12} style={{textAlign: 'left'}}>
                    <label>Was Pass Blitzed?</label>
                </Col>
                <Col span={12} style={{textAlign: 'right'}}>
                    <Select disabled={props.disabled} defaultValue="either"  onChange={handleChange}>
                        <Option value="either">Either</Option>
                        <Option value="1">Yes</Option>
                        <Option value="0">No</Option>
                    </Select>
                </Col>
            </Row>
        </>
    )
}

export default FilterWasBlitz