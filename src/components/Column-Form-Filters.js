import React, {useEffect, useState} from "react";
import {Collapse, Form, Input, Button, Radio, Slider, Modal, Select, InputNumber} from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import statsInputs from './inputs/statsInputs.json'
import filtersPassData from './inputs/filtersPass.json'
import filtersRushData from './inputs/filtersRush.json'
import filtersReceiveData from './inputs/filtersReceive.json'
const { Option, OptGroup } = Select;
const {Panel} = Collapse;



export default function ColumnFormFilters(props) {
    const [filtersPass, setFiltersPass] = useState([])

    useEffect(() => {
        setFiltersPass(filtersPassData)
    }, []);

    

    return (
    <>
        <Collapse className="site-collapse-custom-collapse">
            <Panel header="Global Filters" key="1" className="site-collapse-custom-panel">
            </Panel>
            <Panel header="Pass Filters" key="2" className="site-collapse-custom-panel">
                <Form.List name="filtersPass">
                {(fields, { add, remove }, { errors }) => (
                    <div>
                    {filtersPass.map(filter => (
                        <Form.Item {...filter.formProps} fieldKey={[filter.formProps.name]}>
                            {filter.ui.type === 'select' ? <Select {...filter.ui.props} /> : 
                            filter.ui.type === 'slider' ? <Slider {...filter.ui.props} /> : 
                            filter.ui.type === 'inputNumber' ? <InputNumber {...filter.ui.props} /> : null
                            }
                        </Form.Item>                        
                    ))}
                    </div>
                )}
                </Form.List>
            </Panel>
            <Panel header="Rush Filters" key="3" className="site-collapse-custom-panel">
                <></>
            </Panel>
            <Panel header="Receiving Filters" key="4" className="site-collapse-custom-panel">
                <></>
            </Panel>
        </Collapse>
    </>
    );
};
