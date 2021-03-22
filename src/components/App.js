import React, { useState } from "react";
import './App.css';
import 'antd/dist/antd.css';
import {Layout, Button, Drawer, message, Divider, Row, Col, Form, Modal, } from 'antd';
import Table from './Table'
import ColumnTabs from './query-fields/Column-Tabs'
import RowForm from './query-fields/Row-Form'
import WhereForm from './query-fields/Where-Form'
import CustomCalcTabs from './custom-calcs/Custom-Calc-Tabs'
import {makeRequest, buildTableCalcColumn, buildTableCalcDataSource} from './helper-functions'

const { Content, Footer } = Layout;

function App() {
    const [stateID, setStateID] = useState('');
    const [tableData, setTableData] = useState({});
    const [isFieldDrawerVisible, setIsFieldDrawerVisible] = useState(false);
    const [isCalcVisible, setIsCalcVisible] = useState(false);
    const [resetCount, setResetCount] = useState(1);
    const [queryForm] = Form.useForm()
    const [calcsForm] = Form.useForm()

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
        Object.entries(calcsForm.getFieldsValue())
        .sort((a, b) => a[0].slice(4) - b[0].slice(4))   // sort based on the number in calcIndex (e.g. calc1 before calc2)
        .forEach(([calcIndex, calc]) => {
            setTableData(prev => {
                const newColumns = buildTableCalcColumn(calcIndex, calc, prev.columns)
                const newDataSource = buildTableCalcDataSource(calcIndex, calc, prev.dataSource)
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

    async function submitQuery(formFields) {
        const hide = message.loading({content: 'Loading the data', style: {fontSize: '1rem'}}, 0)
        try { 
            const tableData = await makeRequest(formFields)
            hide()
            if (tableData) {
                setTableData(tableData)
                setIsFieldDrawerVisible(false)
                return true
            } else {
                message.error({content: 'An error occurred. Please refresh the page and try again.', duration: 5, style: {fontSize: '1rem'} })
                return false
            }
        } catch(err) {
            console.log(err)
            hide()
            message.error({content: 'An error occurred. Please refresh the page and try again.', duration: 5, style: {fontSize: '1rem'} })
            return false
        }
        
    }

    async function onSubmit() {
        queryForm.validateFields()
        .then(values => submitQuery(values))
        .catch(errorInfo => {
            // console.log(errorInfo);
            message.error({content: 'Ensure every column has a stat type and year selected.', duration: 2.5, style: {fontSize: '1rem'} })
        })
    }

    function resetQueryForm() {
        queryForm.resetFields()
        setResetCount(resetCount+1)
    }

    const fieldDrawerProps = {
        title: 'Edit Fields',
        width: '70%',
        visible: isFieldDrawerVisible,
        placement: 'left',
        onClose: () => setIsFieldDrawerVisible(false),
        bodyStyle: { paddingBottom: 80 },
    }

    const queryFormProps = {
        form: queryForm,
        name: 'query',
        initialValues: { row: { field: 'player_name_with_position'} }
    }

    const calcsFormProps = {
        form: calcsForm,
        name: 'calcs',
        initialValues: { },
        labelCol: { span: 12, },
        wrapperCol: { span: 12 },
        labelAlign: 'left',
        colon: false,

    }

    const calcModalProps = {
        title: "Edit Custom Calculations",
        visible: isCalcVisible,
        onOk: submitCustomCalcs,
        onCancel: () => setIsCalcVisible(false),
        width: 750,
        style: {top: 150}
    }

    return (
    <>
    <Layout hasSider={false} className="site-layout-background" style={{ minHeight: '100vh' }}>
        <Content style={{ margin: '20px 16px 0px', overflow: 'initial'}}>

            <Button type="primary" onClick={() => setIsFieldDrawerVisible(true)}>Edit Fields</Button>
            <Button type="secondary" onClick={handleShowCalc}>Edit Custom Calcs</Button>
            <Button type="danger" onClick={() => console.log(tableData)}>Debug: Table Data</Button>
            <Button type="danger" onClick={() => console.log(queryForm.getFieldsValue())}>Debug: Form getFieldsValue</Button>
            <Button type="danger" onClick={() => console.log(calcsForm.getFieldsValue())}>Debug: Calc getFieldsValue</Button>

            <Table tableData={tableData} />

            <Drawer {...fieldDrawerProps} footer={
                <div style={{textAlign: 'right',}}>
                <Button type="danger" onClick={resetQueryForm}>Reset Form</Button>
                <Button onClick={() => setIsFieldDrawerVisible(false)} style={{ marginRight: 8 }}> Close </Button>
                <Button  type="primary" onClick={() => onSubmit()}> Submit </Button> {/*onClick={submitQueryFields}*/}
                </div>
            }>
                
                <Form {...queryFormProps} key={`queryForm_reset_${resetCount}`}>
                    <RowForm />
                    <Divider orientation="center" plain>Row Filters (Optional)</Divider>
                    <WhereForm />
                    <ColumnTabs queryForm={queryForm} />
                </Form>
            </Drawer>

            <Modal {...calcModalProps}>
                <Form  {...calcsFormProps} >
                    {tableData.columns && tableData.columns.length > 0 ?
                    <CustomCalcTabs tableData={tableData} />
                    : <p>Please select fields first</p>}
                </Form>
            </Modal>
        
        </Content>

        <Footer style={{ textAlign: 'center', padding: '12px'}}>NFL Plays Table ©2020 Created by Jon Baird</Footer>
    </Layout>
    </>
    );
}

export default App;
