import React from "react";
import { TreeSelect } from 'antd';
import 'antd/dist/antd.css';


function SelectYears(props) {

  function handleYearChange (value) {
    props.setYears(value);
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
    },
    {
      title: "2017",
      value: "2017",
      key: "2017"
    },
    {
      title: "2016",
      value: "2016",
      key: "2016"
    }
  ];

  const tProps = {
    treeData,
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