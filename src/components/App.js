import React, { useState } from "react";
import './App.css';
import 'antd/dist/antd.css';
import Table from './Table'
import SelectRow from './SelectRow'
import SelectYears from './SelectYears'
import SelectColumns from './SelectColumns'
import { Layout, Button } from 'antd';

const { Content, Sider } = Layout;


function App() {
  // controls the "row" selection - string, 'player_name' or 'team_name'
  const [row, setRow] = useState('player_name');
  // controls the "columns" selection - array of strings: ['sum_yds_pass', 'sum_att_rush', ...]
  const [columns, setColumns] = useState([]);
  // controls the "years" selection - array of strings: ['2020', '2019', ...]
  const [years, setYears] = useState([]);

  // controls the table's data; data is received via submit button
  const [tableData, setTableData] = useState([]);
  function addTableData(tableData) {
    setTableData(prevData => tableData);
  }
  
  // handles submission of query and updating table data results
  async function handleSubmit(e) {
    const queryBody = {
      row: row,
      columns: columns,
      years: years
    }
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryBody)
    }
    const response = await fetch(`http://localhost:9000/query`, fetchOptions)
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
    addTableData(tableData)
  }

  const siderProps = {
    theme: "light",
    style : {
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0
    }
  }

  return (
    <div>
    <Layout>
      <Sider {... siderProps}>
        <SelectRow setRow={setRow} />
        <SelectYears setYears={setYears} />
        <SelectColumns setColumns={setColumns} />
        <Button type="primary" onClick={handleSubmit} >Run</Button>
      </Sider>
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
      <Content style={{ margin: '24px 16px 24px', overflow: 'initial' }}>
        <div className="site-layout-background" style={{ textAlign: 'center' }}>
          <Table tableData={tableData} />
        </div>
      </Content>
      {/* <Footer style={{ textAlign: 'center' }}>©2020 NFL-Table</Footer> */}
    </Layout>
  </Layout>
    </div>
  );
}

export default App;
