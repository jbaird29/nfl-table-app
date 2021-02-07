import React, { useState } from "react";
import './App.css';
import 'antd/dist/antd.css';
import Table from './Table'
import SelectRow from './SelectRow'
import SelectYears from './SelectYears'
import SelectStats from './SelectStats'
import FilterInside20 from './FilterInside20'
import FilterPassAtt from './FilterPassAtt'
import { Layout, Button, Collapse } from 'antd';

const { Content, Sider, Footer } = Layout;
const { Panel } = Collapse;

function App() {
  // the states for query request
  const [row, setRow] = useState('player_name');  // string: 'player_name' or 'team_name'
  const [passStats, setPassStats] = useState([]);  // array of strings: ['sum_yds_pass', ...]
  const [rushStats, setRushStats] = useState([]);  // array of strings: ['sum_yds_pass', ...]
  const [recvStats, setRecvStats] = useState([]);  // array of strings: ['sum_yds_pass', ...]
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
    // concatenate the pass rush and receiving stats
    const stats = passStats.concat(rushStats).concat(recvStats)

    const where = []  // construct where filters; only add properties whose values are not null or undefined
    inside20 && where.push({field: 'inside_20', operator: '=', values: [inside20]})

    const having = []  // construct having filters; only add properties whose values are not null or undefined
    minPassAtt && having.push({field: 'sum_att_pass', operator: '>=', value: minPassAtt})

    // build the body and options for the fetch request
    const queryBody = {row: row, stats: stats, years: years, where: where, having: having}
    const fetchOptions = { method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(queryBody)
    }
    const response = await fetch(`http://localhost:9000/query`, fetchOptions)
    const tableData = await response.json();

    // add sort functions depending on data type
    function addSorter(column) {
      if (column.dataType === 'number') {
        const columnName = column.dataIndex
        column.sorter = (a, b) => a[columnName] - b[columnName]
      } else if (column.dataType === 'string') {
        const columnName = column.dataIndex
        column.sorter = (a, b) => (a[columnName].toUpperCase() < b[columnName].toUpperCase() ? -1 : 1)
      }
    }

    // add render functions depending on format type
    function addRender(column) {
      if (column.format === 'dec_0') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toLocaleString()}`}</span>)
      } else if (column.format === 'dec_1') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toFixed(1).toLocaleString()}`}</span>)
      } else if (column.format === 'dec_2') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toFixed(2).toLocaleString()}`}</span>)
      } else if (column.format === 'index') {
        column.render = (text, row, index) => (!text ? text : <span>{`${index + 1} - ${text}`}</span>)
      }
    }

    // for each column, add (1) sorter function (2) render function
    tableData.columns.forEach(column => {
      if ('children' in column) {
        column.children.forEach(child => {
          addSorter(child);
          addRender(child);
        })
      } else {
        addSorter(column);
        addRender(column);
      }
    })
    // add the new response to the tableData state
    addTableData(tableData)
  }

  const siderProps = {
    theme: "light",
    width: '28%',
    // collapsible: true,
    style : {
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
      // padding: '2px'
    }
  }

  return (
    <>
    <Layout hasSider={true}>
      <Sider {... siderProps}>
        <SelectRow setRow={setRow} />
        <SelectYears setYears={setYears} />
        <Collapse className="site-collapse-custom-collapse">
          <Panel header="Select Stats" key="1" className="site-collapse-custom-panel">
            <SelectStats setPassStats={setPassStats} setRushStats={setRushStats} setRecvStats={setRecvStats} />
          </Panel>
          <Panel header="Select Filters" key="2" className="site-collapse-custom-panel">
            <FilterInside20 setInside20={setInside20} />
            <FilterPassAtt setMinPassAtt={setMinPassAtt} />
          </Panel>
        </Collapse>
        <Button type="primary" onClick={handleSubmit} >Run</Button>
      </Sider>
    <Layout className="site-layout" style={{ marginLeft: '28%' }}>
      <Content style={{ margin: '24px 16px 24px', overflow: 'initial' }}>
        <div className="site-layout-background" style={{ textAlign: 'center' }}>
          <Table tableData={tableData} />
        </div>
      </Content>
    </Layout>
    </Layout>
    </>
  );
}

export default App;
