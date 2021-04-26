import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Layout, Button, message, Divider, Row, Col, Form, Modal, Steps, Spin, Tabs, Typography } from "antd";
import { DownloadOutlined, CloudUploadOutlined } from "@ant-design/icons";
import Table from "./Table";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import { TableData, TableColumn, TableRow } from "./types/MainTypes";
import QueryForm from "./query-form/QueryForm";
import CustomCalc from "./custom-calcs/CustomCalc";

const { Header, Sider, Content, Footer } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;
const queryFormV = 1;
const calcsFormV = 1;

function QueryPage() {
    // tableData
    const initialTableData: TableData = { columns: [], dataSource: [] };
    const initialTableInfo = { sorter: { field: null, order: null }, filters: {} };
    const [tableData, setTableData] = useState<TableData>(initialTableData);
    const [tableInfo, setTableInfo] = useState(initialTableInfo);
    // queryForm
    const [savedQueryFields, setSavedQueryFields] = useState(null); // ensures ShareableURL matches what the user sees in table
    // UI render
    const [isFieldDrawerVisible, setIsFieldDrawerVisible] = useState(false);
    const [isCalcVisible, setIsCalcVisible] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);

    const location = useLocation();

    const handleEditCustomCalcsClick = () => {
        if (tableData.columns.length > 0) {
            setIsCalcVisible(true);
        } else {
            message.error({ content: "Run a query before adding custom calculations.", duration: 2.5, style: { fontSize: "1rem" } });
        }
    };

    return (
        <>
            <Layout>
                <Sider width={300} style={{ backgroundColor: "#FFF", textAlign: "center", borderRight: "1px solid #d8d9dc" }}>
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
                            <Button block onClick={() => null} shape="round" icon={<DownloadOutlined />}>
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
                />

                <CustomCalc
                    isVisible={isCalcVisible}
                    setIsVisible={setIsCalcVisible}
                    tableData={tableData}
                    setTableData={setTableData}
                    tableInfo={tableInfo}
                />
            </Layout>
        </>
    );
}

export default QueryPage;
