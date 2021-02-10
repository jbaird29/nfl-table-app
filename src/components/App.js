import React, { useState } from "react";
import './App.css';
import 'antd/dist/antd.css';
import Table from './Table'
import Inputs from './Inputs'
import {Modal, Row, Col, Layout, Button, Collapse, Divider, Radio} from 'antd';

const { Content, Sider, Footer } = Layout;
const { Panel } = Collapse;


function App() {
  const [tableData, setTableData] = useState([]);

  const siderProps = {
    theme: "light",
    width: '25%',
    // collapsible: true,
    style : {
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
      padding: '5px'
    }
  }

  return (
    <>
    <Layout hasSider={true}>
      <Sider {... siderProps}>
        <Inputs setTableData={setTableData} />
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
