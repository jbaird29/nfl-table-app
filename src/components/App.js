import React, { useState, useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {Layout, Button, Drawer, message, Divider, Row, Col, Form, Modal, Steps, Spin, Alert, Image, Tabs, Typography, Menu } from 'antd';
import { DownloadOutlined, CloudUploadOutlined, CopyOutlined,  } from '@ant-design/icons';
import Table from './Table'
import ColumnTabs from './query-fields/Column-Tabs'
import RowForm from './query-fields/Row-Form'
import WhereForm from './query-fields/Where-Form'
import CustomCalcTabs from './custom-calcs/Custom-Calc-Tabs'
import SelectPage from './standard-pages/SelectPage'
import { toCSV, copyTableWithoutCalcs, addCalcsToTable, addRenderSorterToTable} from './helper-functions'
import { Switch, Route, Link, useLocation, useParams} from 'react-router-dom';
import logo from '../images/logo.png'

const { Header, Sider, Content, Footer } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs
const { Title, Paragraph } = Typography
const queryFormV = 1
const calcsFormV = 1

function App() {
    // application state
    const [queryForm] = Form.useForm()
    const [calcsForm] = Form.useForm()
    const [savedQueryFields, setSavedQueryFields] = useState(null)  // ensures ShareableURL matches what the user sees in table
    const [savedCalcsFields, setSavedCalcsFields] = useState(null)  // ensures ShareableURL matches what the user sees in table
    const [initialQueryPanes, setInitialQueryPanes] = useState([])
    const [initialCalcsPanes, setInitialCalcsPanes] = useState([])
    // table state
    const [tableData, setTableData] = useState({});
    const [tableInfo, setTableInfo] = useState( {sorter: {field: null, order: null},  filters: {} })
    // reset helpers
    const [resetQuery, setResetQuery] = useState(1);
    const [resetCalcs, setResetCalcs] = useState(1);
    // UI render - query page
    const [isFieldDrawerVisible, setIsFieldDrawerVisible] = useState(false);
    const [isCalcVisible, setIsCalcVisible] = useState(false);
    const [step, setStep] = useState(0)
    const [loadingPage, setLoadingPage] = useState(false)
    // UI render - URL page
    const [loadingURL, setLoadingURL] = useState(false)
    const [isURLVisible, setIsURLVisible] = useState(false)
    const [urlText, setURLText] = useState('')

    const location = useLocation();

    // onSubmit query --> setSavedQueryFields; setSavedCalcsFields(null)
    // useEffect(savedQueryFields) --> async fetch(); addSorterRender(); setTableData()

    // onSubmit calcs --> setSavedCalcsFields()
    // useEffect(savedCalcsFields) --> copyTableWithoutCalcs(); addCalcs(); addSorterRender(); setTableData()

    // useEffect(pageLoad) --> async fetch(); setSavedQueryFields(); setSavedCalcsFields(); 


    // when the page is first loaded, check to see if a ?sid= state is included
    useEffect(() => {
        const url = new URL(window.location)
        const sid = url.searchParams.get('sid')
        if (sid) {
            loadState(sid)
        } else {
            setInitialQueryPanes([{ title: 'Col 1', key: '1' }])
            setInitialCalcsPanes([{ title: 'Calc 1', key: '1' }])
        }
    }, []);    

    // ?sid=a~j-X0qNUJmB9SjtujjB        = basic test with cols and calcs
    // ?sid=1Q1yy-YLX8ijesPJepLK        = basic test with cols anc calcs
    // ?sid=erR4RDlPXKielMpWBYzn        = deletes Col1 and Calc1; shows only Col2 and Calc2 in table
    //                                    ASSERT that adding new tab is index of 3
    // ?sid=5nqfxVMpXUen5bQ5Jf6o        = adds Col1 and Col2; adds Calc1; then changes Col2 (so Calc1 disappears)
    //                                    ASSERT that Calcs form is empty
    // ?sid=5TjRMklHXcivbsQYzJSf        = 8 columns & 4 calcs

    async function loadState(sid) {
        const hide = message.loading({content: 'Loading the data', style: {fontSize: '1rem'}}, 0)
        setLoadingPage(true)
        const response = await fetch(`/loadState?sid=${sid}`, { method: 'GET'})
        if (response.ok) {
            const data = await response.json()
            const {tableInfo, queryFields, calcsFields, tableData } = data
            if (queryFields) {
                setInitialQueryPanes(Object.keys(queryFields.columns).map(colIndex => ({ title: `Col ${colIndex.slice(3)}`, key: `${colIndex.slice(3)}` })))
                queryForm.setFieldsValue(queryFields)
                setSavedQueryFields(queryFields)
            } else {
                setInitialQueryPanes([{ title: 'Col 1', key: '1' }])
            }
            if (calcsFields) {
                setInitialCalcsPanes(Object.keys(calcsFields).map(calcIndex => ({ title: `Calc ${calcIndex.slice(4)}`, key: `${calcIndex.slice(4)}` })))
                calcsForm.setFieldsValue(calcsFields)   
                addCalcsToTable(tableData, calcsFields)
                setSavedCalcsFields(calcsFields)
            } else {
                setInitialCalcsPanes([{ title: 'Calc 1', key: '1' }])
            }
            addRenderSorterToTable(tableData, tableInfo)
            setTableData(tableData)
            hide()
            setLoadingPage(false)
        } else {
            console.log('An error occurred')
            hide()
            setLoadingPage(false)
            message.error({content: `There was an error loading that page. Unfortunately the link is no longer valid.`, duration: 2.5, style: {fontSize: '1rem'} })
        }
        const url = new URL(window.location)
        url.searchParams.delete('sid')
        window.history.pushState({}, '', url);
    }

    async function saveState() {
        const saveData = {queryFormV, calcsFormV, tableInfo,  queryFields: savedQueryFields, calcsFields: savedCalcsFields}
        const response = await fetch(`/saveState`, { method: 'POST', headers: {'Content-Type': 'application/json'},body: JSON.stringify(saveData)})
        const data = await response.json()
        return response.ok ? {success: true, stateID: data.stateID} : {success: false, error: response.statusText}
    }
    
    async function onShareURL() {
        if (!tableData.columns) {
            message.error({content: `Please run a query before generating a shareable URL.`, duration: 2.5, style: {fontSize: '1rem'} })
            return
        }
        setLoadingURL(true); setIsURLVisible(true)
        const save = await saveState()
        if(save.success) {
            setLoadingURL(false)
            setURLText(`${window.origin}?sid=${save.stateID}`)
        } else {
            console.log(save.error)
            message.error({content: `There was an error. Please refresh the page and try again.`, duration: 2.5, style: {fontSize: '1rem'} })
            setLoadingURL(false); setIsURLVisible(false)
        }
    }

    function submitCustomCalcs () {
        // FIRST: validate that every colIndex is in tableData
        const allColIndexes = tableData.columns.filter(column => column.title.startsWith('Col'))
                            .map(column => column.children[0].dataIndex)
        const hasInvalidCol = Object.entries(calcsForm.getFieldsValue())
                            .some(([calcIndex, calc]) => (
                            (calc.colIndex1.startsWith('col') && !allColIndexes.includes(calc.colIndex1))
                            || (calc.colIndex2.startsWith('col') && !allColIndexes.includes(calc.colIndex2)) ))        
        if (hasInvalidCol) {
            message.error({content: 'Some of these fields are no longer in the table.', duration: 2.5, style: {fontSize: '1rem'} })
            return
        }
        // CONTINUE: if valid
        const newTableData = copyTableWithoutCalcs(tableData)
        addCalcsToTable(newTableData, calcsForm.getFieldsValue())
        addRenderSorterToTable(newTableData, tableInfo)
        setTableData(newTableData)
        setIsCalcVisible(false)
        setSavedCalcsFields(calcsForm.getFieldsValue())
    }

    async function submitQuery(formFields) {
        const hide = message.loading({content: 'Loading the data', style: {fontSize: '1rem'}}, 0)
        try {
            const fetchOptions = { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formFields) } 
            const response = await fetch(`/runQuery`, fetchOptions)
            if (!response.ok) {
                hide()
                const error = await response.json()
                message.error({content: 'An error occurred. Please refresh the page and try again.', duration: 5, style: {fontSize: '1rem'} })
                console.log(error)
                return false
            } else {
                hide()
                const tableData = await response.json();
                if (tableData) {
                    addRenderSorterToTable(tableData, tableInfo)
                    setTableData(tableData)
                    setIsFieldDrawerVisible(false)
                    setSavedCalcsFields(null)
                    setSavedQueryFields(formFields)
                    return true
                } else {
                    message.error({content: 'An error occurred. Please refresh the page and try again.', duration: 5, style: {fontSize: '1rem'} })
                    return false
                }
            }
        } catch(err) {
            console.log(err)
            hide()
            message.error({content: 'An error occurred. Please refresh the page and try again.', duration: 5, style: {fontSize: '1rem'} })
            return false
        }        
    }

    function handleShowCalc() {
        if (tableData.columns && tableData.columns.length > 0) {
            setIsCalcVisible(true)
        } else {
            message.error({content: 'Please run a query before adding Custom Calculations.', duration: 2.5, style: {fontSize: '1rem'} })
        }
    }


    async function onSubmit() {
        queryForm.validateFields()
        .then(values => submitQuery(values))
        .catch(errorInfo => {
            // console.log(errorInfo);
            message.error({content: 'Ensure every column has a stat type selected.', duration: 2.5, style: {fontSize: '1rem'} })
        })
    }

    
    function resetQueryForm() { setInitialQueryPanes([{ title: 'Col 1', key: '1' }]); queryForm.resetFields(); setResetQuery(resetQuery+1) }
    function resetCalcsForm() { setInitialCalcsPanes([{ title: 'Calc 1', key: '1' }]); calcsForm.resetFields(); setResetCalcs(resetCalcs+1) }

    function onDownload() {
        if (!tableData.columns) {
            message.error({content: `Please run a query before downloading data.`, duration: 2.5, style: {fontSize: '1rem'} })
            return
        }
        const blob = new Blob([toCSV(tableData)], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a");
        link.style.visibility = 'hidden';
        link.setAttribute("href", url);
        link.setAttribute("download", "datatable.csv");
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link);
    }

    const fieldDrawerProps = {
        title: 'Edit Query Fields',
        width: '55%',
        visible: isFieldDrawerVisible,
        placement: 'left',
        onClose: () => setIsFieldDrawerVisible(false),
        bodyStyle: { paddingBottom: 24, paddingLeft: 12, paddingRight: 12,  },
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
        onCancel: () => {setIsURLVisible(false); setURLText('') },
        onOk: () => {setIsURLVisible(false); setURLText('') },
        width: 550,
        style: {top: 150}
    }

    const siderWidth = 300


    return (
    <>
    
    <Layout style={{ minHeight: '100vh' }}>    
    
        <Sider width={300} style={{backgroundColor: '#FFF', textAlign: 'center'}}>
        <Spin spinning={loadingPage}>
            
            <Menu defaultSelectedKeys={location.pathname.includes('pages') ? 'pages' : 'query'} mode="horizontal" style={{lineHeight: '2.5rem', marginBottom: 12}}>
                <Menu.Item key="query"><Link to="/">Custom Query</Link></Menu.Item>
                <Menu.Item key="pages"><Link to="/pages">Standard Pages</Link></Menu.Item>
            </Menu>

            <Switch>
                <Route exact path="/">
                    <Row style={{padding: '6px 12px'}}><Button block type="primary" onClick={() => setIsFieldDrawerVisible(true)}>Edit Query Fields</Button></Row>
                    <Row style={{padding: '6px 12px'}}><Button block onClick={handleShowCalc}>Edit Custom Calcs</Button></Row>
                    <Divider />
                    <Row style={{padding: '6px 12px'}}><Button block onClick={onShareURL} shape="round" icon={<CloudUploadOutlined />}>Generate URL</Button></Row>
                    <Row style={{padding: '6px 12px'}}><Button block onClick={onDownload} shape="round" icon={<DownloadOutlined />}>Download Data</Button></Row>
                </Route>
                <Route path="/pages">
                    <SelectPage setTableData={setTableData} setSavedCalcsFields={setSavedCalcsFields} setSavedQueryFields={setSavedQueryFields}/>
                </Route>
            </Switch>
        
            </Spin>
        </Sider>
        

        <Layout >
        

            <Header style={{backgroundColor: '#FFF', margin: '5px', padding: '0 10px'}}>
                <Row>
                <Col span={6}>
                    <Image style={{padding: '8px 0px', }} width={200} src={logo} alt='logo' />
                </Col>
                <Col span={18} style={{ textAlign: 'right'}}>
                    <Button type="danger" onClick={() => console.log(tableData)}>Table Data</Button>
                    <Button type="danger" onClick={() => console.log(queryForm.getFieldsValue())}>Form getFieldsValue</Button>
                    <Button type="danger" onClick={() => console.log(calcsForm.getFieldsValue())}>Calc getFieldsValue</Button>
                </Col>
                </Row>
            </Header>

            <Content style={{margin: '0 5px'}}>
                {!tableData.columns 
                ? <Footer style={{ textAlign: 'center', height: '22', padding: '20px 0px'}}>NFL Table ©{new Date().getFullYear()} Created by Jon Baird</Footer>
                : <Table setTableInfo={setTableInfo} tableData={tableData} />
                }
                

                <Drawer {...fieldDrawerProps} footer={
                    <div style={{textAlign: 'right',}}>
                    <Button danger onClick={resetQueryForm} style={{ marginRight: 8 }}>Reset</Button>
                    <Button onClick={() => setIsFieldDrawerVisible(false)} style={{ marginRight: 8 }}> Close </Button>
                    <Button  type="primary" onClick={() => onSubmit()}> Submit </Button> {/*onClick={submitQueryFields}*/}
                    </div>
                }>

                    <Steps type="navigation" current={step} onChange={(current) => setStep(current)}
                                size="small" className="site-navigation-steps" >
                        <Step status={step === 0 ? "process" : "wait"}  title="Select Row Type" />
                        <Step status={step === 1 ? "process" : "wait"} title="Add Columns"/>
                        {/* <Step status={step === 2 ? "process" : "wait"} title="Global Filters"/> */}
                    </Steps>

                    <Form {...queryFormProps} key={`queryForm_reset_${resetQuery}`}>
                        <div style={step === 0 ? {} : { display: 'none' } } >
                            <RowForm />
                        </div>
                        <div style={step === 1 ? {} : { display: 'none' } } >
                            <ColumnTabs initialQueryPanes={initialQueryPanes}  queryForm={queryForm} />
                        </div>
                        {/* <div style={step === 2 ? {} : { display: 'none' } } >
                            <WhereForm />
                        </div> */}
                    </Form>

                </Drawer>

                <Modal {...calcModalProps} footer={
                    <div style={{textAlign: 'right',}}>
                    <Button danger onClick={resetCalcsForm} style={{ marginRight: 2 }}>Reset</Button>
                    <Button onClick={() => setIsCalcVisible(false)} style={{ marginRight: 2 }}> Close </Button>
                    <Button  type="primary" onClick={submitCustomCalcs}>Submit</Button> {/*onClick={submitQueryFields}*/}
                    </div>
                }>
                    <Form  {...calcsFormProps} key={`calcsForm_reset_${resetCalcs}`}>
                        {tableData.columns && tableData.columns.length > 0 ?
                        <CustomCalcTabs initialCalcsPanes={initialCalcsPanes} tableData={tableData} calcsForm={calcsForm} />
                        : <p>Please select fields first</p>}
                    </Form>
                </Modal>

                <Modal {...urlModalProps}>
                    <Spin spinning={loadingURL}>
                        <Row><Paragraph style={{color: 'grey', fontSize: '0.9rem', margin: 'auto'}} keyboard 
                            copyable={{icon: <CopyOutlined style={{paddingLeft: 4, fontSize: '1.1rem'}} key="copy-icon" />,}}
                        >{urlText}</Paragraph></Row>
                    </Spin>         

                </Modal>
            
            </Content>
            
        </Layout>
    </Layout>
    
    </>
    );
}

export default App;
