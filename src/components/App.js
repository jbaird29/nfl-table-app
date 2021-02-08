import React, { useState } from "react";
import './App.css';
import 'antd/dist/antd.css';
import Table from './Table'
import SelectRow from './selections/SelectRow'
import SelectYears from './selections/SelectYears'
import SelectStats from './selections/SelectStats'
import FilterInside20 from './filters/FilterInside20'
import FilterPassAtt from './filters/FilterPassAtt'
import { Modal, Row, Col, Layout, Button, Collapse, Divider } from 'antd';

const { Content, Sider, Footer } = Layout;
const { Panel } = Collapse;

function App() {
  // --------------------------------------------------------------------------------------------------------------
  // the states for query request
  // --------------------------------------------------------------------------------------------------------------
  const [row, setRow] = useState('player_name');  // string: 'player_name' or 'team_name'
  const [yearRange, setYearRange] = useState([2019, 2020]);  // array of min/max years: [2016, 2020]
  const [passStats, setPassStats] = useState([]);  // array of strings: ['sum_yds_pass', ...]
  const [rushStats, setRushStats] = useState([]);  // array of strings: ['sum_yds_pass', ...]
  const [recvStats, setRecvStats] = useState([]);  // array of strings: ['sum_yds_pass', ...]
  const [inside20, setInside20] = useState(null);  // string: '1' or '0' or null
  const [minPassAtt, setMinPassAtt] = useState()  // number: 100 or 10

  // controls the table's data; data is received via submit button
  const [tableData, setTableData] = useState([]);
  function addTableData(tableData) {
    setTableData(prevData => tableData);
  }


  // --------------------------------------------------------------------------------------------------------------
  // handles submission of query and updating table data results
  // --------------------------------------------------------------------------------------------------------------
  async function handleSubmit(e) {
    if (passStats.length === 0 && rushStats.length === 0 && recvStats.length === 0) {
      Modal.error({
        title: 'Please select at least one stat',
        content: 'Underneath the the Select Stats drop down box',
      });
      return
    }

    // concatenate the pass rush and receiving stats
    const stats = passStats.concat(rushStats).concat(recvStats)

    // fill out the years array
    const years = []
    for (let i = yearRange[0]; i <= yearRange[1]; i++) {
      years.push(i)
    }

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
    width: '25%',
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
        <Row align='middle' style={{padding: '10px 7px 10px 7px'}}>
          <Col span={4} style={{textAlign: 'left'}}>
            <Button type="primary" onClick={handleSubmit} >Run Query</Button>
          </Col>
          <Col span={20} style={{textAlign: 'right'}}>
            {/*<i style={{color: 'red'}}>Please select at least one stat</i>*/}
          </Col>
        </Row>
        <Divider dashed style={{margin: '5px 0px'}}/>
        <SelectRow setRow={setRow} />
        <Divider dashed style={{margin: '5px 0px'}}/>
        <SelectYears setYearRange={setYearRange} />
        <Collapse className="site-collapse-custom-collapse">
          <Panel header="Select Stats" key="1" className="site-collapse-custom-panel">
            <SelectStats setPassStats={setPassStats} setRushStats={setRushStats} setRecvStats={setRecvStats} />
          </Panel>
          <Panel header="Select Filters" key="2" className="site-collapse-custom-panel">
            <FilterInside20 setInside20={setInside20} />
            <Divider dashed style={{margin: '5px 0px'}} />
            <FilterPassAtt setMinPassAtt={setMinPassAtt} />
          </Panel>
        </Collapse>
      </Sider>
    <Layout className="site-layout-background" style={{ marginLeft: '25%', minHeight: '100vh' }}>
      <Content style={{ margin: '20px 16px 0px', overflow: 'initial'}}>
        {/*<div className="site-layout-background" style={{ textAlign: 'center' }}>*/}
          <Table tableData={tableData} />
        {/*</div>*/}
      </Content>
      <Footer style={{ textAlign: 'center', padding: '12px'}}>NFL Plays Table ©2020 Created by Jon Baird</Footer>
    </Layout>
    </Layout>
    </>
  );
}

export default App;
