import React, { useState } from "react";
import { InputNumber } from 'antd';


function FilterPassAtt(props) { 

  function handleChange(value) {
    props.setMinPassAtt(prevValue => value ? value : null);
  }
  
  return (
    <div>
      <label for='minPassAtt'>Minimum Pass Attempts</label>
      <InputNumber id='minPassAtt' min={1} onChange={handleChange} />
    </div>
  )
}

export default FilterPassAtt