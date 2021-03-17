import React, { useState } from "react";
import './App.css';
import 'antd/dist/antd.css';
import Table from './Table'
import ColumnTabs from './Column-Tabs'
import RowForm from './Row-Form'
import {Modal, Row, Col, Layout, Button, Collapse, Divider, Radio, Drawer, Tabs} from 'antd';
import {buildRequestBody, makeRequest} from './submit-functions'

const { Content, Sider, Footer } = Layout;
const { Panel } = Collapse;
const { TabPane } = Tabs;

function App() {
    const [tableData, setTableData] = useState([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [globalForm, setGlobalForm] = useState({
        row: {field: 'player_name'},
        col1: {}
    });

    function showDrawer() { setIsDrawerVisible(true) }
    function onClose() { setIsDrawerVisible(false) }
    async function onSubmit() {
        console.log(globalForm)
        const requestBody = buildRequestBody(globalForm)
        console.log(requestBody)
        const tableData = await makeRequest(requestBody)
        setTableData(tableData)
    }

    // function onFinish(values) {
    //     // if there are no pass, rush, or recv stats selected, throw an error to user
    //     if (!values.field) {
    //         Modal.error({title: 'Please select a stat'});
    //         return
    //     }
    //     if (!values.otherFilters.year) {
    //         Modal.error({title: 'Please select a year'});
    //         return
    //     }
    // };

    const drawerProps = {
        title: 'Edit Fields',
        width: '60%',
        visible: isDrawerVisible,
        placement: 'left',
        onClose: onClose,
        bodyStyle: { paddingBottom: 80 }
    }


    return (
    <>
    <Layout hasSider={false} className="site-layout-background" style={{ minHeight: '100vh' }}>
        <Content style={{ margin: '20px 16px 0px', overflow: 'initial'}}>
            <Button type="primary" onClick={showDrawer}>Edit Fields</Button>
            <Table tableData={tableData} />
            <Drawer {...drawerProps} >
                <Button onClick={onClose} style={{ marginRight: 8 }}> Close </Button>
                <Button onClick={onSubmit} type="primary"> Submit </Button>
                <RowForm setGlobalForm={setGlobalForm} />
                <ColumnTabs setGlobalForm={setGlobalForm} />
            </Drawer>
        </Content>
        <Footer style={{ textAlign: 'center', padding: '12px'}}>NFL Plays Table ©2020 Created by Jon Baird</Footer>
    </Layout>
    </>
    );
}

export default App;
