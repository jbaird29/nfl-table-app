import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Layout, Button, message, Divider, Row, Col, Form, Modal, Steps, Spin, Tabs, Typography, FormInstance } from "antd";
import { DownloadOutlined, CloudUploadOutlined, CopyOutlined } from "@ant-design/icons";
import Table from "./Table";
import { Switch, Route, Link, useLocation, useHistory } from "react-router-dom";
import { TableData, TableColumn, TableRow, QueryFields, CalcsFields, TableInfo, SaveData } from "./types/MainTypes";
import QueryForm from "./query-form/QueryForm";
import CustomCalcForm from "./custom-calcs/CustomCalcForm";
import { addRenderSorterToTable, downloadData, messageDisplay } from "./helper-functions";

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
    queryFields: QueryFields;
    saveID: string;
}

export default function QueryPage(props: QueryPageProps) {
    const { siderProps } = props;
    // tableData
    const initialTableData: TableData = { columns: [], dataSource: [] };
    const initialTableInfo: TableInfo = { sorter: { field: undefined, order: undefined }, filters: {} };
    const [tableData, setTableData] = useState<TableData>(initialTableData);
    const [tableInfo, setTableInfo] = useState<TableInfo>(initialTableInfo);
    const [resetTableCount, setResetTableCount] = useState(0);
    // queryForm
    const [queryForm] = Form.useForm<FormInstance>();
    const [savedQueryFields, setSavedQueryFields] = useState<QueryFields | null>(null); // ensures ShareableURL matches what the user sees in table
    // calcsForm
    const [calcsForm] = Form.useForm<FormInstance>();
    const [savedCalcsFields, setSavedCalcsFields] = useState<CalcsFields | null>(null); // ensures ShareableURL matches what the user sees in table
    // UI render
    const [isFieldDrawerVisible, setIsFieldDrawerVisible] = useState(false);
    const [isCalcsDrawerVisible, setIsCalcsDrawerVisible] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    // shareable URL
    const [isURLVisible, setIsURLVisible] = useState(false);
    const [urlText, setURLText] = useState("");
    const [loadingURL, setLoadingURL] = useState(false);

    const location = useLocation<LocationRedirect>();
    const history = useHistory();

    // when the page is first loaded, check to see if a query should be loaded
    useEffect(() => {
        const isRedirectFromStandardPage = location.state && location.state.queryFields;
        if (isRedirectFromStandardPage) {
            loadQueryForm(location.state.queryFields);
            setIsFieldDrawerVisible(true);
            history.push("/query", {});
        }
        const isRedirectFromSave = location.state && location.state.saveID;
        if (isRedirectFromSave) {
            console.log(location.state.saveID);
            loadQuery(location.state.saveID);
            history.push("/query", {});
        }
    }, []);

    async function loadQuery(saveID: string) {
        const hide = message.loading({ content: "Loading the data", style: { fontSize: "1rem" } }, 0);
        setLoadingPage(true);
        const response = await fetch(`/loadQuery?saveID=${saveID}`, { method: "GET" });
        if (response.ok) {
            const data: SaveData = await response.json();
            const { queryFormV, calcsFormV, tableInfo, tableData, queryFields, calcsFields } = data;
            loadQueryForm(queryFields);
            loadCalcsForm(calcsFields);
            addRenderSorterToTable(tableData, tableInfo);
            setTableInfo(tableInfo);
            setTableData(tableData);
            setResetTableCount((prev) => prev + 1); // forces a rerender of the table; defaultSortOrder wouldn't work otherwise
        } else {
            const data: { error: string } = await response.json();
            console.log(data.error);
            messageDisplay("error", `There was an error loading the query. Unfortunately the link is no longer valid.`);
        }
        hide();
        setLoadingPage(false);
    }

    const saveQuery = async (saveData: SaveData) => {
        const response = await fetch(`/saveQuery`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saveData),
        });
        const data = await response.json();
        return response.ok ? { success: true, saveID: data.saveID } : { success: false, error: response.statusText };
    };

    const onShareURL = async () => {
        if (!tableData.columns || tableData.columns.length === 0) {
            messageDisplay("error", `Please run a query before generating a shareable URL.`);
            return;
        }
        setLoadingURL(true);
        setIsURLVisible(true);
        const saveData = { queryFormV, calcsFormV, tableInfo, tableData, queryFields: savedQueryFields, calcsFields: savedCalcsFields };
        const save = await saveQuery(saveData);
        if (save.success) {
            setLoadingURL(false);
            setURLText(`${window.origin}/saves/${save.saveID}`);
        } else {
            console.log(save.error);
            messageDisplay("error", `There was an error. Please refresh the page to try again.`);
            setLoadingURL(false);
            setIsURLVisible(false);
        }
    };

    const loadQueryForm = (queryFields: QueryFields | null) => {
        queryForm.setFieldsValue(queryFields as any);
        setSavedQueryFields(queryFields);
    };

    const loadCalcsForm = (calcsFields: CalcsFields | null) => {
        calcsForm.setFieldsValue(calcsFields as any);
        setSavedCalcsFields(calcsFields);
    };

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

    const urlModalProps = {
        title: "Shareable URL",
        visible: isURLVisible,
        footer: null,
        onCancel: () => {
            setIsURLVisible(false);
            setURLText("");
        },
        onOk: () => {
            setIsURLVisible(false);
            setURLText("");
        },
        width: 550,
        style: { top: 150 },
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
                            <Button block onClick={() => handleDownloadClick()} shape="round" icon={<DownloadOutlined />}>
                                Download Data
                            </Button>
                        </Row>
                        <Row style={{ padding: "6px 12px" }}>
                            <Button block onClick={() => onShareURL()} shape="round" icon={<CloudUploadOutlined />}>
                                Save &#38; Share URL
                            </Button>
                        </Row>
                        <Row style={{ padding: "6px 12px" }}>
                            <Button
                                block
                                onClick={() => {
                                    console.log(tableData);
                                    console.log(tableInfo);
                                    setResetTableCount((prev) => prev + 1);
                                }}
                                shape="round"
                                icon={<CloudUploadOutlined />}
                            >
                                TableData
                            </Button>
                        </Row>
                    </Spin>
                </Sider>
                <Content style={{ margin: "0 5px" }}>
                    <Table setTableInfo={setTableInfo} tableData={tableData} key={`reset_${resetTableCount}`} />
                </Content>

                <QueryForm
                    isVisible={isFieldDrawerVisible}
                    setIsVisible={setIsFieldDrawerVisible}
                    setTableData={setTableData}
                    initialTableData={initialTableData}
                    initialTableInfo={initialTableInfo}
                    queryForm={queryForm}
                    setSavedQueryFields={setSavedQueryFields}
                    setSavedCalcsFields={setSavedCalcsFields}
                />

                <CustomCalcForm
                    isVisible={isCalcsDrawerVisible}
                    setIsVisible={setIsCalcsDrawerVisible}
                    tableData={tableData}
                    setTableData={setTableData}
                    tableInfo={tableInfo}
                    calcsForm={calcsForm}
                    setSavedCalcsFields={setSavedCalcsFields}
                />

                <Modal {...urlModalProps}>
                    <Spin spinning={loadingURL}>
                        <Row>
                            <Paragraph
                                style={{ color: "grey", fontSize: "0.9rem", margin: "auto" }}
                                keyboard
                                copyable={{ icon: <CopyOutlined style={{ paddingLeft: 4, fontSize: "1.1rem" }} key="copy-icon" /> }}
                            >
                                {urlText}
                            </Paragraph>
                        </Row>
                    </Spin>
                </Modal>
            </Layout>
        </>
    );
}
