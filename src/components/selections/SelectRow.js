import React from "react";
import { Row, Col, Radio } from 'antd';
import 'antd/dist/antd.css';


function SelectRow(props) {

  function handleRowChange(e) {
    props.setRow(e.target.value);
  }


  return (
      <Row align='middle' style={{paddingLeft: '7px'}}>
          <Col span={12} style={{textAlign: 'left'}}>
              <label>Select Row Type</label>
          </Col>
          <Col span={12} style={{textAlign: 'left'}}>
            <Radio.Group onChange={handleRowChange} defaultValue="player_name" >
                {/* could do Radio.Button here instead */}
              <Radio value="player_name">Player</Radio>
              <Radio value="team_name">Team</Radio>
            </Radio.Group>
          </Col>
      </Row>
  )
}

export default SelectRow