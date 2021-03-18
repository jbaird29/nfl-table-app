import React, { useState } from "react";
import './App.css';
import 'antd/dist/antd.css';
import Table from './Table'
import ColumnTabs from './Column-Tabs'
import RowForm from './Row-Form'
import CustomCalc from './Custom-Calc'
import {Modal, Row, Col, Layout, Button, Collapse, Divider, Radio, Drawer, Tabs, message, Space} from 'antd';
import {addRender, addSorter, buildRequestBody, makeRequest} from './submit-functions'

const { Content, Sider, Footer } = Layout;
const { Panel } = Collapse;
const { TabPane } = Tabs;

function App() {
    const [tableData, setTableData] = useState({});
    const [isFieldDrawerVisible, setIsFieldDrawerVisible] = useState(false);
    const [isCalcVisible, setIsCalcVisible] = useState(false);
    const [globalForm, setGlobalForm] = useState({
        row: {field: 'player_name'},
        columns: []
    });
    // const exampleState = {
    //     row: {field: 'player_name'},
    //     columns: [{field: 'sum_att_pass', colIndex: 'col1', filtersPass: {blitzed: '1'}, filtersOther: {year: '2020'}}]
    // }

    async function onSubmit() {
        if (!globalForm.columns || globalForm.columns.length === 0) {
            message.error({content: 'Please select fields', duration: 2.5, style: {fontSize: '1rem'} })
            return
        } else if (globalForm.columns.filter(column => typeof(column.field) === 'undefined').length > 0) {
            message.error({content: 'Ensure every column has a stat type selected.', duration: 2.5, style: {fontSize: '1rem'} })
            return
        } else if (globalForm.columns.filter(column => typeof(column.filtersOther.year) === 'undefined').length > 0) {
            message.error({content: 'Ensure every column has a year selected.', duration: 2.5, style: {fontSize: '1rem'} })
            return
        }
        const hide = message.loading({content: 'Loading the data', style: {fontSize: '1rem'}}, 0)
        try {
            const requestBody = buildRequestBody(globalForm)
            console.log(requestBody)    
            const tableData = await makeRequest(requestBody)
            setTableData(tableData)
            setIsFieldDrawerVisible(false)
            hide() 
        } catch(err) {
            console.log(err)
            hide()
            message.error({content: 'An error occurred. Please refresh the page and try again.', duration: 5, style: {fontSize: '1rem'} })
        }
    }

    function handleShowCalc() {
        if (tableData.columns && tableData.columns.length > 0) {
            setIsCalcVisible(true)
        } else {
            message.error({content: 'Please select fields first', duration: 2.5, style: {fontSize: '1rem'} })
        }
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

    const fieldDrawerProps = {
        title: 'Edit Fields',
        width: '60%',
        visible: isFieldDrawerVisible,
        placement: 'left',
        onClose: () => setIsFieldDrawerVisible(false),
        bodyStyle: { paddingBottom: 80 }
    }

    return (
    <>
    <Layout hasSider={false} className="site-layout-background" style={{ minHeight: '100vh' }}>
        <Content style={{ margin: '20px 16px 0px', overflow: 'initial'}}>

            <Button type="primary" onClick={() => setIsFieldDrawerVisible(true)}>Edit Fields</Button>
            <Button type="secondary" onClick={handleShowCalc}>Edit Custom Calcs</Button>
            <Button type="secondary" onClick={() => console.log(tableData)}>See Table Data</Button>

            <Table tableData={tableData} />

            <Drawer {...fieldDrawerProps} >
                <Button onClick={() => setIsFieldDrawerVisible(false)} style={{ marginRight: 8 }}> Close </Button>
                <Button onClick={onSubmit} type="primary"> Submit </Button>
                <RowForm setGlobalForm={setGlobalForm} />
                <ColumnTabs setGlobalForm={setGlobalForm} />
            </Drawer>

            <CustomCalc isVisible={isCalcVisible} setVisible={setIsCalcVisible}  setTableData={setTableData} tableData={tableData}/>
        </Content>

        <Footer style={{ textAlign: 'center', padding: '12px'}}>NFL Plays Table ©2020 Created by Jon Baird</Footer>
    </Layout>
    </>
    );
}

export default App;
