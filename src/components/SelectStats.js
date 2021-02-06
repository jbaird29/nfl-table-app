import React, { useState, useEffect } from "react";
import { TreeSelect } from 'antd';
import 'antd/dist/antd.css';


function SelectStats(props) {
  const [inputs, setInputs] = useState([])

  useEffect(() => {
    fetch(`http://localhost:9000/stats-inputs`)
    .then(resp => resp.json())
    .then(data => setInputs(data))
  }, []);

  function handleChange (value) {
    props.setStats(value);
  }

  const treeData = inputs

  // const treeData = [
  //   {
  //     title: "Pass Yards",
  //     value: "sum_yds_pass",
  //     key: "sum_yds_pass"
  //   },
  //   {
  //     title: "Pass Attempts",
  //     value: "sum_att_pass",
  //     key: "sum_att_pass"
  //   },
  //   {
  //     title: "Rush Yards",
  //     value: "sum_yds_rush",
  //     key: "sum_yds_rush"
  //   },
  //   {
  //     title: "Rush Attempts",
  //     value: "sum_att_rush",
  //     key: "sum_att_rush"
  //   },
  //   {
  //     title: "Receiving Yards",
  //     value: "sum_yds_recv",
  //     key: "sum_yds_recv"
  //   },
  //   {
  //     title: "Receiving Targets",
  //     value: "sum_tgt_recv",
  //     key: "sum_tgt_recv"
  //   },
  // ];

  const tProps = {
    treeData,
    onChange: handleChange,
    treeCheckable: true,
    placeholder: "Select stats",
    maxTagCount: 3,
    style: {
      width: "100%"
    }
  };

  return (
    <TreeSelect {...tProps} />
  )
}

export default SelectStats