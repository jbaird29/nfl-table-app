import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Layout, Button, message, Divider, Row, Col, Form, Modal, Steps, Spin, Tabs, Typography, FormInstance } from "antd";
import { DownloadOutlined, CloudUploadOutlined } from "@ant-design/icons";
import Table from "./Table";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import { TableData, TableColumn, TableRow, Query } from "./types/MainTypes";
import QueryForm from "./query-form/QueryForm";
import CustomCalcForm from "./custom-calcs/CustomCalcForm";
import { downloadData } from "./helper-functions";

const { Header, Sider, Content, Footer } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;
const queryFormV = 1;
const calcsFormV = 1;

interface QueryPageProps {
    siderProps: any;
}

interface LocationRedirect extends Location {
    queryFields: Query;
}

export default function QueryPage(props: QueryPageProps) {
    const { siderProps } = props;
    // tableData
    const initialTableData: TableData = { columns: [], dataSource: [] };
    const initialTableInfo = { sorter: { field: null, order: null }, filters: {} };
    const [tableData, setTableData] = useState<TableData>(initialTableData);
    const [tableInfo, setTableInfo] = useState(initialTableInfo);
    // queryForm
    const [queryForm] = Form.useForm<FormInstance>();
    const [savedQueryFields, setSavedQueryFields] = useState<Query | null>(null); // ensures ShareableURL matches what the user sees in table
    // calcsForm
    const [calcsForm] = Form.useForm<FormInstance>();
    // UI render
    const [isFieldDrawerVisible, setIsFieldDrawerVisible] = useState(false);
    const [isCalcsDrawerVisible, setIsCalcsDrawerVisible] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);

    const location = useLocation<LocationRedirect>();

    // when the page is first loaded, check to see if a query should be loaded
    useEffect(() => {
        const isRedirectFromStandardPage = location.state && location.state.queryFields;
        if (isRedirectFromStandardPage) {
            loadQueryForm(location.state.queryFields);
        }
    }, []);

    function loadQueryForm(queryFields: Query) {
        queryForm.resetFields();
        queryForm.setFieldsValue(queryFields as any);
        setSavedQueryFields(queryFields);
        setIsFieldDrawerVisible(true);
    }

    const handleEditCustomCalcsClick = () => {
        if (!tableData.columns || tableData.columns.length === 0) {
            message.error({ content: "Run a query before adding custom calculations.", duration: 2.5, style: { fontSize: "1rem" } });
        } else {
            setIsCalcsDrawerVisible(true);
        }
    };

    const handleDownloadClick = () => {
        if (!tableData.columns) {
            message.error({ content: `Please run a query before downloading data.`, duration: 2.5, style: { fontSize: "1rem" } });
        } else {
            downloadData(tableData);
        }
    };

    return (
        <>
            <Layout>
                <Sider {...siderProps}>
                    <Spin spinning={loadingPage}>
                        <Row style={{ padding: "6px 12px" }}>
                            <Button block type="primary" onClick={() => setIsFieldDrawerVisible(true)}>
                                Edit Query Fields
                            </Button>
                        </Row>
                        <Row style={{ padding: "6px 12px" }}>
                            <Button block onClick={() => handleEditCustomCalcsClick()}>
                                Edit Custom Calcs
                            </Button>
                        </Row>
                        <Divider />
                        <Row style={{ padding: "6px 12px" }}>
                            <Button block onClick={() => null} shape="round" icon={<CloudUploadOutlined />}>
                                Generate URL
                            </Button>
                        </Row>
                        <Row style={{ padding: "6px 12px" }}>
                            <Button block onClick={() => handleDownloadClick()} shape="round" icon={<DownloadOutlined />}>
                                Download Data
                            </Button>
                        </Row>
                    </Spin>
                </Sider>
                <Content style={{ margin: "0 5px" }}>
                    <Table setTableInfo={setTableInfo} tableData={tableData} />
                </Content>

                <QueryForm
                    isVisible={isFieldDrawerVisible}
                    setIsVisible={setIsFieldDrawerVisible}
                    setTableData={setTableData}
                    initialTableData={initialTableData}
                    initialTableInfo={initialTableInfo}
                    queryForm={queryForm}
                />

                <CustomCalcForm
                    isVisible={isCalcsDrawerVisible}
                    setIsVisible={setIsCalcsDrawerVisible}
                    tableData={tableData}
                    setTableData={setTableData}
                    tableInfo={tableInfo}
                    calcsForm={calcsForm}
                />
            </Layout>
        </>
    );
}
