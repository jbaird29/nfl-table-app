import React, { useState } from "react";
import { Radio } from 'antd';
import 'antd/dist/antd.css';


function SelectRow(props) {
  const [row, setRow] = useState("player");

  function handleRowChange(e) {
    setRow(prevValue => e.target.value);
    props.addQuery({row: e.target.value})
  }


  return (
    <Radio.Group onChange={handleRowChange} defaultValue="player_name" buttonStyle="solid">
      <Radio.Button value="player_name">Player</Radio.Button>
      <Radio.Button value="team_name">Team</Radio.Button>
    </Radio.Group>
  )
}

export default SelectRow