import React, { useState } from "react";
import { TreeSelect } from 'antd';
import 'antd/dist/antd.css';


function SelectYears(props) {
  const [years, setYears] = useState([]);

  function handleYearChange (value) {
    setYears(prevValue => value);
    props.addQuery({years: value})
  }

  const treeData = [
    {
      title: "2020",
      value: "2020",
      key: "2020"
    },
    {
      title: "2019",
      value: "2019",
      key: "2019"
    },
    {
      title: "2018",
      value: "2018",
      key: "2018"
    }
  ];

  const tProps = {
    treeData,
    value: years,
    onChange: handleYearChange,
    treeCheckable: true,
    placeholder: "Select years",
    maxTagCount: 3,
    style: {
      width: "100%"
    }
  };

  return (
    <TreeSelect {...tProps} />
  )
}

export default SelectYears