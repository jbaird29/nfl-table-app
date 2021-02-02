import React, { useState } from "react";
import { InputNumber } from 'antd';


function FilterPassAtt(props) {  

  return (
    <InputNumber min={1} defaultValue={100} />
  )
}

export default FilterPassAtt