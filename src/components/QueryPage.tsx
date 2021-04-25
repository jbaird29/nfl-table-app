import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import {
    Layout,
    Button,
    Drawer,
    message,
    Divider,
    Row,
    Col,
    Form,
    Modal,
    Steps,
    Spin,
    Image,
    Tabs,
    Typography,
    Menu,
    notification,
    DrawerProps,
} from "antd";
import {
    DownloadOutlined,
    CloudUploadOutlined,
    CopyOutlined,
    QuestionCircleOutlined,
    HomeOutlined,
    UserOutlined,
    TeamOutlined,
    MonitorOutlined,
} from "@ant-design/icons";
import Table from "./Table";
import ColumnTabs from "./query-fields/Column-Tabs";
import RowForm from "./query-fields/Row-Form";
import WhereForm from "./query-fields/Where-Form";
import CustomCalcTabs from "./custom-calcs/Custom-Calc-Tabs";
import { toCSV, copyTableWithoutCalcs, addCalcsToTable, addRenderSorterToTable } from "./helper-functions";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import QueryColumn from "./query-form/QueryColumn";
import QueryRow from "./query-form/QueryRow";
import QueryRowFilter from "./query-form/QueryRowFilter";
import { TableData, TableColumn, TableRow } from "./types/MainTypes";
import QueryForm from "./query-form/QueryForm";

const { Header, Sider, Content, Footer } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;
const queryFormV = 1;
const calcsFormV = 1;

function QueryPage() {
    // tableData
    const initialTableData: TableData = { columns: [], dataSource: [] };
    const [tableData, setTableData] = useState<TableData>(initialTableData);
    const [tableInfo, setTableInfo] = useState({ sorter: { field: null, order: null }, filters: {} });
    // queryForm
    const [savedQueryFields, setSavedQueryFields] = useState(null); // ensures ShareableURL matches what the user sees in table
    // UI render
    const [isFieldDrawerVisible, setIsFieldDrawerVisible] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);

    const location = useLocation();

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
                            <Button block onClick={() => null}>
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
                />
            </Layout>
        </>
    );
}

export default QueryPage;
