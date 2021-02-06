import React, { useState } from "react";
import './App.css';
import 'antd/dist/antd.css';
import Table from './Table'
import SelectRow from './SelectRow'
import SelectYears from './SelectYears'
import SelectStats from './SelectStats'
import FilterInside20 from './FilterInside20'
import FilterPassAtt from './FilterPassAtt'
import { Layout, Button } from 'antd';

const { Content, Sider } = Layout;


function App() {
  // the states for query request
  const [row, setRow] = useState('player_name');  // string: 'player_name' or 'team_name'
  const [stats, setStats] = useState([]);  // array of strings: ['sum_yds_pass', 'sum_att_rush', ...]
  const [years, setYears] = useState([]);  // array of strings: ['2020', '2019', ...]
  const [inside20, setInside20] = useState(null);  // string: '1' or '0' or null
  const [minPassAtt, setMinPassAtt] = useState()  // number: 100 or 10

  // controls the table's data; data is received via submit button
  const [tableData, setTableData] = useState([]);
  function addTableData(tableData) {
    setTableData(prevData => tableData);
  }
  
  // handles submission of query and updating table data results
  async function handleSubmit(e) {
    const where = []  // construct where filters; only add properties whose values are not null or undefined
    inside20 && where.push({field: 'inside_20', operator: '=', values: [inside20]})

    const having = []  // construct having filters; only add properties whose values are not null or undefined
    minPassAtt && having.push({field: 'sum_att_pass', operator: '>=', value: minPassAtt})

    // build the body for the API request
    const queryBody = {
      row: row,
      stats: stats,
      years: years,
      where: where,
      having: having,
    }
    // fetch the data
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryBody)
    }
    const response = await fetch(`http://localhost:9000/query`, fetchOptions)
    const tableData = await response.json();
    // for each column, depending on string/number, add (1) sorter function (2) render function
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
    // add the new response to the tableData state
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
        <SelectStats setStats={setStats} />
        <FilterInside20 setInside20={setInside20} />
        <FilterPassAtt setMinPassAtt={setMinPassAtt} />
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
