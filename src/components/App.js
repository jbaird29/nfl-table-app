import React, { useState } from "react";
import './App.css';
import 'antd/dist/antd.css';
import Table from './Table'
import SelectRow from './SelectRow'
import SelectYears from './SelectYears'
import SelectColumns from './SelectColumns'
import SelectSubmit from './SelectSubmit'
import { Layout, Menu, Button } from 'antd';


const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;


function App() {
  // this controls the state for the table's data; fields are updated via the form addTableData prop
  const [tableData, setTableData] = useState([]);
  function addTableData(tableData) {
    setTableData(prevData => tableData);
  }

  // this sets state for the API request
  const [query, setQuery] = useState({row: "player_name", years: [], columns: []})
  function addQuery(update) {
    setQuery(prevData => {
      return Object.assign(prevData, update)
    })
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
        <SelectRow addQuery={addQuery} />
        <SelectYears addQuery={addQuery} />
        <SelectColumns addQuery={addQuery} />
        <SelectSubmit query={query} addTableData={addTableData}>Run</SelectSubmit>
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
