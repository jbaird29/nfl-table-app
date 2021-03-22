import React from "react";
import {Form, Select, Slider, InputNumber, } from 'antd';
import filtersWhere from '../../inputs/filtersWhere.json'


export default function WhereForm(props) {

    return (<>

            {/* <Form.Item label="Player Position" name="player_position">
                <Select {...selectProps}/>
            </Form.Item> */}

            {filtersWhere.map(filter => (
                <Form.Item {...filter.formProps} name={['where', filter.name]} key={filter.name} >
                {filter.ui.type === 'select' ? <Select {...filter.ui.props} /> : 
                    filter.ui.type === 'slider' ? <Slider {...filter.ui.props} /> : 
                    filter.ui.type === 'inputNumber' ? <InputNumber {...filter.ui.props} /> : null
                    }
                </Form.Item>
            ))}

        </>
    );
};
