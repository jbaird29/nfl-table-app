import React, { useState } from "react";
import './App.css';
import 'antd/dist/antd.css';
import {Layout, Button, Drawer, message, } from 'antd';
import Table from './Table'
import ColumnTabs from './query-fields/Column-Tabs'
import RowForm from './query-fields/Row-Form'
import CustomCalc from './custom-calcs/Custom-Calc'
import {buildRequestBody, makeRequest, buildTableCalcColumn, buildTableCalcDataSource} from './helper-functions'

const { Content, Footer } = Layout;

function App() {
    const [stateID, setStateID] = useState('');
    const [tableData, setTableData] = useState({});
    const [isFieldDrawerVisible, setIsFieldDrawerVisible] = useState(false);
    const [isCalcVisible, setIsCalcVisible] = useState(false);
    const [customCalcs, setCustomCalcs] = useState([]);
    const [queryFields, setQueryFields] = useState({
        row: {field: 'player_name'},
        columns: []
    });
    // const exampleState = {
    //     row: {field: 'player_name'},
    //     columns: [{field: 'sum_att_pass', colIndex: 'col1', filtersPass: {blitzed: '1'}, filtersOther: {season_year: '2020'}}]
    // }

    async function submitQueryFields() {
        if (!queryFields.columns || queryFields.columns.length === 0) {
            message.error({content: 'Please select fields', duration: 2.5, style: {fontSize: '1rem'} })
            return
        } else if (queryFields.columns.filter(column => typeof(column.field) === 'undefined').length > 0) {
            message.error({content: 'Ensure every column has a stat type selected.', duration: 2.5, style: {fontSize: '1rem'} })
            return
        } else if (queryFields.columns.filter(column => typeof(column.filters_general.season_year) === 'undefined').length > 0) {
            message.error({content: 'Ensure every column has a year selected.', duration: 2.5, style: {fontSize: '1rem'} })
            return
        }
        const hide = message.loading({content: 'Loading the data', style: {fontSize: '1rem'}}, 0)
        try {
            // setStateID('NEW VALUE')
            // saveState(stateID, queryFields, customCalcs)
            // console.log(queryFields)
            const apiRequestBody = buildRequestBody(queryFields)
            console.log(apiRequestBody)    
            const tableData = await makeRequest(apiRequestBody)
            setTableData(tableData)
            setIsFieldDrawerVisible(false)
            hide() 
        } catch(err) {
            console.log(err)
            hide()
            message.error({content: 'An error occurred. Please refresh the page and try again.', duration: 5, style: {fontSize: '1rem'} })
        }
    }

    function submitCustomCalcs () {
        // setStateID('NEW VALUE')
        // saveState(stateID, queryFields, customCalcs)
        const hide = message.loading({content: 'Loading the data', style: {fontSize: '1rem'}}, 0)
        // remove the custom calcs from table data
        setTableData(prev => {
            const newColumns = prev.columns.filter(column => !column.title.startsWith('Calculation'))
            const newDataSource = prev.dataSource.map(prior => (
                Object.assign(...Object.keys(prior)
                .filter(key => !key.startsWith('calc'))
                .map(key => ({[key]: prior[key]})) )))
            return {columns: newColumns, dataSource: newDataSource}
        })
        // add the custom calcs to table data
        customCalcs.sort((a, b) => a.calcIndex.slice(4) - b.calcIndex.slice(4)).forEach(customCalc => {
            setTableData(prev => {
                const newColumns = buildTableCalcColumn(customCalc, prev.columns)
                const newDataSource = buildTableCalcDataSource(customCalc, prev.dataSource)
                return {columns: newColumns, dataSource: newDataSource}
            })
        })
        setIsCalcVisible(false)
        hide()
    }

    function handleShowCalc() {
        if (tableData.columns && tableData.columns.length > 0) {
            setIsCalcVisible(true)
        } else {
            message.error({content: 'Please select fields first', duration: 2.5, style: {fontSize: '1rem'} })
        }
    }

    const fieldDrawerProps = {
        title: 'Edit Fields',
        width: '70%',
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
            <Button type="danger" onClick={() => console.log(tableData)}>Debug: Table Data</Button>
            <Button type="danger" onClick={() => console.log(queryFields)}>Debug: QueryFields</Button>

            <Table tableData={tableData} />

            <Drawer {...fieldDrawerProps} >
                <Button onClick={() => setIsFieldDrawerVisible(false)} style={{ marginRight: 8 }}> Close </Button>
                <Button onClick={submitQueryFields} type="primary"> Submit </Button>
                <RowForm setQueryFields={setQueryFields} />
                <ColumnTabs setQueryFields={setQueryFields} />
            </Drawer>

            <CustomCalc isVisible={isCalcVisible} setVisible={setIsCalcVisible} setTableData={setTableData} tableData={tableData}
                customCalcs={customCalcs} setCustomCalcs={setCustomCalcs} submitCustomCalcs={submitCustomCalcs}
            />
        
        </Content>

        <Footer style={{ textAlign: 'center', padding: '12px'}}>NFL Plays Table ©2020 Created by Jon Baird</Footer>
    </Layout>
    </>
    );
}

export default App;
