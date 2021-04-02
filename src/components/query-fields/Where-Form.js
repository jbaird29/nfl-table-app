import React from "react";
import {Form, Select, Slider, InputNumber, Typography} from 'antd';
import filtersWhere from '../../inputs/filtersWhere.json'
const {Title, Paragraph} = Typography

export default function WhereForm(props) {

    return (<>
            <Paragraph style={{textAlign: 'center'}}>Global filters are optional. These filters will be applied to ALL columns.</Paragraph>
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
