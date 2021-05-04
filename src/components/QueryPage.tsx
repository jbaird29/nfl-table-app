import { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Layout, Button, message, Divider, Row, Form, Spin, FormInstance } from "antd";
import { DownloadOutlined, CloudUploadOutlined } from "@ant-design/icons";
import Table from "./Table";
import { useLocation, useHistory } from "react-router-dom";
import { TableData, QueryFields, CalcsFields, TableInfo, SaveData } from "./types/MainTypes";
import QueryForm from "./query-form/QueryForm";
import CustomCalcForm from "./custom-calcs/CustomCalcForm";
import { addRenderSorterToTable, downloadData, messageDisplay } from "./helper-functions";
import SaveQuery from "./save-query/SaveQuery";

const { Sider, Content } = Layout;
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
    const initialTableData: TableData = { columns: [], dataSource: [], queryTitle: undefined };
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
    const [isSaveQueryVisible, setIsSaveQueryVisible] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);

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
            loadQuery(location.state.saveID);
            history.push("/query", {});
        }
    }, []);

    const generateQueryTitle = (queryTitle: TableData["queryTitle"], timestamp: SaveData["timestamp"]) => {
        const dateString = timestamp ? ` (Query saved on ${new Date(timestamp).toLocaleDateString()})` : "";
        const titleString = queryTitle ? queryTitle : "";
        return `${titleString}${dateString}`;
    };

    const loadQuery = async (saveID: string) => {
        const hide = message.loading({ content: "Loading the data", style: { fontSize: "1rem" } }, 0);
        setLoadingPage(true);
        try {
            const response = await fetch(`/loadQuery?saveID=${saveID}`, { method: "GET" });
            if (response.ok) {
                const data: SaveData = await response.json();
                const { tableInfo, tableData, queryFields, calcsFields, timestamp } = data;
                tableData.queryTitle = generateQueryTitle(tableData.queryTitle, timestamp);
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
        } catch (err) {
            console.log(err);
        }
        hide();
        setLoadingPage(false);
    };

    const loadQueryForm = (queryFields: QueryFields | null) => {
        queryForm.setFieldsValue(queryFields as any);
        setSavedQueryFields(queryFields);
    };

    const loadCalcsForm = (calcsFields: CalcsFields | null) => {
        calcsForm.setFieldsValue(calcsFields as any);
        setSavedCalcsFields(calcsFields);
    };

    const saveQuery = async (queryTitle: string): Promise<{ success: boolean; saveID?: string; error?: string }> => {
        tableData.queryTitle = queryTitle;
        const saveData: SaveData = {
            queryFormV,
            calcsFormV,
            tableInfo,
            tableData,
            queryFields: savedQueryFields,
            calcsFields: savedCalcsFields,
        };
        try {
            const response = await fetch(`/saveQuery`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(saveData),
            });
            const data = await response.json();
            return response.ok ? { success: true, saveID: data.saveID } : { success: false, error: response.statusText };
        } catch (err) {
            console.log(err);
            return { success: false, error: err };
        }
    };

    const handleShareURL = async () => {
        if (!tableData.columns || tableData.columns.length === 0) {
            messageDisplay("error", `Please run a query before generating a shareable URL.`);
            return;
        } else {
            setIsSaveQueryVisible(true);
        }
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
                            <Button block onClick={() => handleShareURL()} shape="round" icon={<CloudUploadOutlined />}>
                                Save &#38; Share URL
                            </Button>
                        </Row>
                    </Spin>
                </Sider>
                <Content style={{ margin: "0 5px", maxHeight: "calc(100vh - 64px)" }}>
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

                <SaveQuery isVisible={isSaveQueryVisible} setIsVisible={setIsSaveQueryVisible} saveQuery={saveQuery} />
            </Layout>
        </>
    );
}
