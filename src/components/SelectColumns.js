import React, { useState } from "react";
import { TreeSelect } from 'antd';
import 'antd/dist/antd.css';


function SelectColumns(props) {
  const [columns, setColumns] = useState([]);

  function handleColumnsChange (value) {
    setColumns(prevValue => value);
    props.addQuery({columns: value})
  }

  const treeData = [
    {
      title: "Pass Yards",
      value: "sum_yds_pass",
      key: "sum_yds_pass"
    },
    {
      title: "Pass Attempts",
      value: "sum_att_pass",
      key: "sum_att_pass"
    },
    {
      title: "Rush Yards",
      value: "sum_yds_rush",
      key: "sum_yds_rush"
    },
    {
      title: "Rush Attempts",
      value: "sum_att_rush",
      key: "sum_att_rush"
    },
    {
      title: "Receiving Yards",
      value: "sum_yds_recv",
      key: "sum_yds_recv"
    },
    {
      title: "Receiving Targets",
      value: "sum_tgt_recv",
      key: "sum_tgt_recv"
    },
  ];

  const tProps = {
    treeData,
    value: columns,
    onChange: handleColumnsChange,
    treeCheckable: true,
    placeholder: "Select columns",
    maxTagCount: 3,
    style: {
      width: "100%"
    }
  };

  return (
    <TreeSelect {...tProps} />
  )
}

export default SelectColumns