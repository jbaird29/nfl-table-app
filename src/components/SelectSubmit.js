import React, { useState } from "react";
import { Button } from 'antd';
import 'antd/dist/antd.css';


function SelectSubmit(props) {

  async function handleClick(e) {
    const queryParams = new URLSearchParams(props.query)
    const fetchOptions = {
      method: 'GET',
    }
    const response = await fetch(`http://localhost:9000/query?${queryParams.toString()}`, fetchOptions)
    const tableData = await response.json();
    tableData.columns.forEach(column => {
      if(column.dataType === 'number') {
        const columnName = column.dataIndex
        column.sorter = (a, b) => a[columnName] - b[columnName]
      } else if (column.dataType === 'string') {
        column.render = (text, row, index) => (<span>{`${index+1} - ${text}`}</span>)
        const columnName = column.dataIndex
        column.sorter = (a, b) => {
          return a[columnName].toUpperCase() < b[columnName].toUpperCase() ? -1 : 1
        } 
      }
    })
    props.addTableData(tableData)
  }

  return (
    <Button type="primary" onClick={handleClick} >Run</Button>
  )
}

export default SelectSubmit