import React, {useEffect, useState} from "react";
import {Form, Select, Slider, InputNumber} from 'antd';


export default function PassFilters(props) {
    const [passFilters, setPassFilters] = useState([])

    async function fetchFilters() {
        const response = await fetch(`http://localhost:9000/filter-inputs/pass`)
        const data = await response.json()
        return data
    }

    useEffect(async () => {
        const data = await fetchFilters()
        setPassFilters(data)
    }, []);


    function renderUI(filter) {
        const formProps = filter.formProps
        const uiProps = filter.ui.props
        if (filter.ui.type === 'select') {
            return(
                <Form.Item {...formProps} key={formProps.label} >
                    <Select {...uiProps} />
                </Form.Item>
            )
        }
        if (filter.ui.type === 'slider') {
            return (
                <Form.Item {...formProps} key={formProps.label} >
                    <Slider {...uiProps} />
                </Form.Item>
            )
        }
        if (filter.ui.type === 'inputNumber') {
            return (
                <Form.Item {...formProps} key={formProps.label} >
                    <InputNumber {...uiProps} />
                </Form.Item>
            )
        }
    }


    return (
        <>
            {passFilters.map(renderUI)}
        </>
    )
}