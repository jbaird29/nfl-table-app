import React, { useState, useEffect } from "react";
import { Select } from 'antd';
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
        fetch(`http://localhost:9000/stats-inputs/rush`)
            .then(resp => resp.json()).then(data => setRecvOptions(data))
    }, []);


    function handlePassChange (value) {
        props.setPassStats(value);
    }
    function handleRushChange (value) {
        props.setRushStats(value);
    }
    function handleRecvChange (value) {
        props.setRecvStats(value);
    }


    const selectProps = {
        placeholder: "Please select",
        align: 'center',
        style: { width: '75%'},
        mode: "multiple",
        allowClear: true,
        optionFilterProp: "label",
        maxTagCount: 'responsive',
    }

    return (
        <div style={{textAlign: 'right'}}>
            <label style={{ width: '25%', textAlign: 'left' }}>Passing: </label>
            <Select {...selectProps} onChange={handlePassChange} options={passOptions}/>
            <label style={{ width: '25%', textAlign: 'left' }}>Rushing: </label>
            <Select {...selectProps} onChange={handleRushChange} options={rushOptions}/>
            <label style={{ width: '25%', textAlign: 'left' }}>Receiving: </label>
            <Select {...selectProps} onChange={handleRecvChange} options={recvOptions}/>
        </div>
    )
}

export default SelectStats