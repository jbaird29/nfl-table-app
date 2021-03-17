import React from "react";
import { Row, Col, Slider } from 'antd';


function SelectYears2(props) {

  // https://ant.design/components/slider/
  function onChange(value) {
    props.setYearRange(value)
  }

  const marks = {
    2016: '2016',
    2020: '2020',
  };

  const siderProps = {
    range: true,
    max: 2020,
    min: 2016,
    defaultValue: [2020, 2020],
    marks: marks,
    included: true
  }

  return (
        <Row align='middle' style={{paddingLeft: '7px', paddingRight: '20px',}}>
          <Col span={8} style={{textAlign: 'left'}}>
            <label>Select Years</label>
          </Col>
          <Col span={16}>
            <Slider {... siderProps} />
          </Col>
        </Row>
  )
}

export default SelectYears2