import React, { useState, useEffect } from "react";
import { Select } from 'antd';
import 'antd/dist/antd.css';

function SelectRushStats(props) {
    const [inputs, setInputs] = useState([])

    useEffect(() => {
        fetch(`http://localhost:9000/stats-inputs/rush`)
            .then(resp => resp.json())
            .then(data => setInputs(data))
    }, []);

    function handleChange (value) {
        props.setRushStats(value);
    }

    const selectProps = {
        placeholder: "Please select",
        style: { width: '75%'},
        mode: "multiple",
        // mode: "tags",
        allowClear: true,
        onChange: handleChange,
        optionFilterProp: "label",
        maxTagCount: 'responsive',
        options: inputs,
    }

    return (
        <>
            <label style={{ width: '25%' }}>Rushing: </label>
            <Select {...selectProps}>
            </Select>
        </>
    )
}

export default SelectRushStats