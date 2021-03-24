import React, { useState, useEffect } from "react";
import { v5 as uuidv5 } from 'uuid';
import './App.css';
import 'antd/dist/antd.css';
import {Layout, Button, Drawer, message, Divider, Row, Col, Form, Modal, Steps, Space, Spin, Alert, } from 'antd';
import { DownloadOutlined, ShareAltOutlined, CloudUploadOutlined, CopyOutlined } from '@ant-design/icons';
import Table from './Table'
import ColumnTabs from './query-fields/Column-Tabs'
import RowForm from './query-fields/Row-Form'
import WhereForm from './query-fields/Where-Form'
import CustomCalcTabs from './custom-calcs/Custom-Calc-Tabs'
import {makeRequest, toCSV, copyTableWithoutCalcs, addCalcsToTable, addRenderSorterToTable} from './helper-functions'

const { Content, Footer } = Layout;
const { Step } = Steps;
const queryFormV = 1
const calcsFormV = 1

function App() {
    const [tableData, setTableData] = useState({});
    const [isFieldDrawerVisible, setIsFieldDrawerVisible] = useState(false);
    const [isCalcVisible, setIsCalcVisible] = useState(false);
    const [step, setStep] = useState(0)
    const [resetCount, setResetCount] = useState(1);
    const [queryForm] = Form.useForm()
    const [calcsForm] = Form.useForm()
    const [savedQueryFields, setSavedQueryFields] = useState(null)  // ensures ShareableURL matches what the user sees in table
    const [savedCalscFields, setSavedCalcsFields] = useState(null)  // ensures ShareableURL matches what the user sees in table
    const [loadingURL, setLoadingURL] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)
    const [isURLVisible, setIsURLVisible] = useState(false)
    const [initialQueryPanes, setInitialQueryPanes] = useState([])
    const [initialCalcsPanes, setInitialCalcsPanes] = useState([])
    // TODO - refactor form fields modification approach
    // upon queryForm submit => savedQueryFields = queryForm.getFieldsValue(); savedCalcsFields = {}
    // upon calcsForm submit => savedCalcsFields = calcsForm.getFieldsValue()
    // upon save-state => use whatever values are held in savedQueryFields and savedCalcsFields
    // idea = this will maintain the save of whatever is displayed in the table; it allows the user to modify some fields but
    //    still be able to share the URL corresponding to what is shown in the table

    // TODO - when a tab is deleted form a form, its value is not return via getFieldsValue() but it IS
    //        still included in the form state and it is returnable via getFieldValue(['name'])
    //        this is ok right now because when a user deletes a tab, there 

    useEffect(() => {
        setLoadingPage(true)
        loadState()
    }, []);

    // ?sid=a~j-X0qNUJmB9SjtujjB        = working correctly
    // ?sid=1Q1yy-YLX8ijesPJepLK        = working correctly
    // ?sid=erR4RDlPXKielMpWBYzn        = seems to work!

    async function loadState() {
        const url = new URL(window.location)
        const sid = url.searchParams.get('sid')
        if(sid) {
            console.log(sid)
            url.searchParams.delete('sid')
            window.history.pushState({}, '', url);
            const response = await fetch(`http://localhost:9000/load-state?sid=${sid}`, { method: 'GET'})
            if (response.status === 200) {
                const data = await response.json()
                const {queryFields, calcsFields, tableData } = data
                // set the inital query panes based on what is in form response
                setInitialQueryPanes(Object.keys(queryFields.columns).map(colIndex => ({ title: `Column ${colIndex.slice(3)}`, key: `${colIndex.slice(3)}` })))
                setInitialCalcsPanes(Object.keys(calcsFields).map(calcIndex => ({ title: `Calculation ${calcIndex.slice(4)}`, key: `${calcIndex.slice(4)}` })))
                // set the forms
                queryForm.setFieldsValue(queryFields)
                calcsForm.setFieldsValue(calcsFields)   
                // add render/sorter and calculations to the tableData
                addRenderSorterToTable(tableData)
                addCalcsToTable(tableData, calcsFields)
                // set the tableData
                setTableData(tableData)             
            } else {
                console.log('An error occurred')
            }
        } else {
            console.log('no sid')
            setInitialQueryPanes([{ title: 'Column 1', key: '1' }])
            setInitialCalcsPanes([{ title: 'Calculation 1', key: '1' }])
        }
        setLoadingPage(false)
    }

    async function saveState() {
        const saveData = {queryFormV, calcsFormV, queryFields: savedQueryFields, calcsFields: savedCalscFields}
        saveData.stateID = createSID(JSON.stringify(saveData))
        const response = await fetch(`http://localhost:9000/save-state`, { method: 'POST', headers: {'Content-Type': 'application/json'},body: JSON.stringify(saveData)})
        return response.status === 201 ? {success: true, stateID: saveData.stateID} : {success: false, error: response.statusText}
    }
    
    async function onShareURL() {
        if (!tableData.columns) {
            message.error({content: `Please select fields and load data before generating a shareable URL.`, duration: 2.5, style: {fontSize: '1rem'} })
            return
        }
        const urlDOM = document.getElementById('shareable-url')
        urlDOM.innerText = ''
        setLoadingURL(true)
        setIsURLVisible(true)
        const save = await saveState()
        if(save.success) {
            setLoadingURL(false)
            urlDOM.innerText = `${window.origin}?sid=${save.stateID}`
        } else {
            console.log(save.error)
            message.error({content: `There was an error. Please refresh the page and try again.`, duration: 2.5, style: {fontSize: '1rem'} })
            setLoadingURL(false)
            setIsURLVisible(false)
        }
    }


    function submitCustomCalcs () {
        // FIRST: validate that every colIndex is in tableData
        let isValid = true
        // const allColIndexes = tableData.columns.filter(column => column.title.startsWith('Column'))
        //                     .map(column => column.children[0].dataIndex)
        // Object.entries(calcsForm.getFieldsValue()).forEach(([calcIndex, calc]) => {
        //     if (!allColIndexes.includes(calc.colIndex1) || !allColIndexes.includes(calc.colIndex2)) {
        //         isValid = false
        //     }
        // })
        if (!isValid) {
            message.error({content: 'Some of these fields are no longer in the table.', duration: 2.5, style: {fontSize: '1rem'} })
            return
        }
        // CONTINUE: if valid
        const hide = message.loading({content: 'Loading the data', style: {fontSize: '1rem'}}, 0)
        const newTableData = copyTableWithoutCalcs(tableData)
        addCalcsToTable(newTableData, calcsForm.getFieldsValue())
        setTableData(newTableData)
        setIsCalcVisible(false)
        setSavedCalcsFields(calcsForm.getFieldsValue())
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
                addRenderSorterToTable(tableData)
                setTableData(tableData)
                setIsFieldDrawerVisible(false)
                setSavedCalcsFields(null)
                setSavedQueryFields(formFields)
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

    function onDownload() {
        const blob = new Blob([toCSV(tableData)], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "datatable.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link);
    }

    function tableContainsCalcs() {
        return tableData.columns && tableData.columns.length > 0 
                && tableData.columns.filter(column => column.title.startsWith('Calculation')).length > 0
    }

    function createSID(saveDataJSON) {
        const unique = '51d37bbb-b62c-4f24-a1e6-d0778d7d7deb';
        const hexID = uuidv5(saveDataJSON, unique).replaceAll('-', '')
        const base64 = btoa(hexID.slice(0,30).match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join(""))
        const urlEncode = base64.replaceAll('+', '-').replaceAll('/', '~')
        return urlEncode
    }


    const fieldDrawerProps = {
        title: 'Edit Fields',
        width: '60%',
        visible: isFieldDrawerVisible,
        placement: 'left',
        onClose: () => setIsFieldDrawerVisible(false),
        bodyStyle: { paddingBottom: 80 },
    }

    const queryFormProps = {
        form: queryForm,
        name: 'query',
        initialValues: { row: { field: 'player_name_with_position'}, },
        labelAlign: 'left',
        labelCol: { span: 10, },
        wrapperCol: { span: 14, },
        colon: false,
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

    const urlModalProps = {
        title: "Shareable URL",
        visible: isURLVisible,
        footer: null,
        forceRender: true,  // need this so that the querySelect can target the DOM before it is loaded
        onCancel: () => setIsURLVisible(false),
        onOk: () => setIsURLVisible(false),
        width: 650,
        style: {top: 150}
    }


    return (
    <>
    <Layout hasSider={false} className="site-layout-background" style={{ minHeight: '100vh' }}>
        <Content style={{ margin: '20px 16px 0px', overflow: 'initial'}}>
        <Spin spinning={loadingPage}>
            <Row gutter={0}>
            <Col span={12}>
                <Button type="primary" onClick={() => setIsFieldDrawerVisible(true)}>Edit Fields</Button>
                <Button type="secondary" onClick={handleShowCalc}>Edit Custom Calcs</Button>
                <Button type="danger" onClick={() => console.log(tableData)}>Debug: Table Data</Button>
                <Button type="danger" onClick={() => console.log(queryForm.getFieldsValue())}>Debug: Form getFieldsValue</Button>
                <Button type="danger" onClick={() => console.log(calcsForm.getFieldsValue())}>Debug: Calc getFieldsValue</Button>
                <Button type="danger" onClick={() => console.log(calcsForm.getFieldValue(['calc1']))}>Debug: calc1 Value</Button>
                <Button type="danger" onClick={() => console.log(calcsForm.getFieldValue(['calc1']))}>Debug: reset calc1</Button>
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
                <Button type="primary" onClick={onShareURL} shape="round" icon={<CloudUploadOutlined />}>Shareable URL</Button>
                <Button type="primary" onClick={onDownload} shape="round" icon={<DownloadOutlined />}>Download</Button>
            </Col>
            </Row>
            <Row style={{marginTop: 12}}>
                <Table tableData={tableData} />
            </Row>

            <Drawer {...fieldDrawerProps} footer={
                <div style={{textAlign: 'right',}}>
                <Button danger onClick={resetQueryForm} style={{ marginRight: 8 }}>Reset</Button>
                <Button onClick={() => setIsFieldDrawerVisible(false)} style={{ marginRight: 8 }}> Close </Button>
                <Button  type="primary" onClick={() => onSubmit()}> Submit </Button> {/*onClick={submitQueryFields}*/}
                </div>
            }>

                <Steps type="navigation" current={step} onChange={(current) => setStep(current)}
                            size="small" className="site-navigation-steps" >
                    <Step status={step === 0 ? "process" : "wait"} title="Add Columns"/>
                    <Step status={step === 1 ? "process" : "wait"}  title="Select Row Type" />
                </Steps>

                <Form {...queryFormProps} key={`queryForm_reset_${resetCount}`}>
                    <div style={step === 0 ? {} : { display: 'none'  } } >
                        <ColumnTabs initialQueryPanes={initialQueryPanes}  queryForm={queryForm} />
                    </div>
                    <div style={step === 1 ? {} : { display: 'none'  } } >
                        <RowForm />
                        <div className="spacing" style={{marginTop: 36}}></div>
                        <Divider orientation="center" plain>Row Filters (Optional)</Divider>
                        <WhereForm /> 
                    </div>
                </Form>

            </Drawer>

            <Modal {...calcModalProps}>
                <Form  {...calcsFormProps} >
                    {tableData.columns && tableData.columns.length > 0 ?
                    <CustomCalcTabs initialCalcsPanes={initialCalcsPanes} tableData={tableData} />
                    : <p>Please select fields first</p>}
                </Form>
            </Modal>

            <Modal {...urlModalProps}>
                <Spin spinning={loadingURL}>
                <Alert
                    message="Copy the Shareable URL below"
                    size="large"
                    description={<Row>
                            <Col span={20} style={{textAlign: 'center', backgroundColor: '#ccc'}}><div id='shareable-url'></div></Col>
                            <Col span={4}><Button type="default" size="small" icon={<CopyOutlined/>} 
                                 onClick={() => navigator.clipboard.writeText(document.getElementById('shareable-url').innerText)                                 }
                            >
                                Copy</Button></Col>
                            </Row>
                    }
                    type="info"
                    />
                </Spin>

            </Modal>
        </Spin>
        </Content>

        <Footer style={{ textAlign: 'center', padding: '12px'}}>NFL Plays Table ©2020 Created by Jon Baird</Footer>
    </Layout>
    </>
    );
}

export default App;
