import React, {useEffect, useState} from "react";
import {Form, Select, Slider, InputNumber} from 'antd';


export default function PassFilters(props) {
    const [passFilters, setPassFilters] = useState([])

    useEffect(() => {
        fetch(`http://localhost:9000/filter-inputs/pass`)
        .then(resp => resp.json()).then(data => setPassFilters(data))
    }, []);


    return (
        <>
            {/*<Form.Item name={['having', 'sum_att_pass']} label="Minimum Pass Attempts">*/}
            {/*    <InputNumber min={0} />*/}
            {/*</Form.Item>*/}
            {passFilters.map(filter => {
                if (filter.ui.type === 'select') {
                    return(
                        <Form.Item label={filter.label} name={filter.name} key={filter.name} >
                            <Select {...filter.ui.props} />
                        </Form.Item>
                    )
                }
                if (filter.ui.type === 'slider') {
                    return (
                        <Form.Item label={filter.label} name={filter.name} key={filter.name}  >
                            <Slider {...filter.ui.props} />
                        </Form.Item>
                    )
                }
                if (filter.ui.type === 'inputNumber') {
                    return (
                        <Form.Item label={filter.label} name={filter.name} key={filter.name}  >
                            <InputNumber {...filter.ui.props} />
                        </Form.Item>
                    )
                }

            })}
        </>
    )
}