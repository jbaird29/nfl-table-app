import React, { useState } from "react";
import { Radio } from 'antd';


function FilterInside20(props) { 

  function handleChange(e) {
    const value = e.target.value
    props.setInside20(prevValue => value !== 'either' ? value : null);
  }
  
  return (
    <>
      <label for='inside20'>Inside 20 Yard Line?</label>
      <Radio.Group id='inside20' size='small' defaultValue="either" buttonStyle="solid" onChange={handleChange} >
        <Radio.Button value="either">Either</Radio.Button>
        <Radio.Button value="1">Inside</Radio.Button>
        <Radio.Button value="0">Outside</Radio.Button>
      </Radio.Group>
    </>
  )
}

export default FilterInside20