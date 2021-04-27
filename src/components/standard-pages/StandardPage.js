import React, { useState, useEffect } from "react";
import {
    Select,
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
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import Table from "../Table";
import LoadPage from "./LoadPage";
import teamList from "../../inputs/teamList.json";
import playerList from "../../inputs/playerList.json";

const { Header, Sider, Content, Footer } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

function StandardPage(props) {
    const { siderProps, pageType } = props;

    // const initialTableData: TableData = { columns: [], dataSource: [] };
    const initialTableData = { columns: [], dataSource: [] };
    const [tableData, setTableData] = useState(initialTableData);
    const [tableInfo, setTableInfo] = useState({ sorter: { field: null, order: null }, filters: {} });
    const [redirect, setRedirect] = useState(false);
    const [pageID, setPageID] = useState();

    const history = useHistory();

    const onIDSelect = (pageID) => {
        if (pageID) {
            history.push(`/${pageType}/${encodeURI(pageID)}`);
            setPageID(pageID);
        } else {
            setPageID(null);
        }
    };

    // const onPlayerSelect = (id) => history.push(`/player/${encodeURI(id)}`)
    // const onTeamSelect   = (id) => history.push(`/team/${encodeURI(id)}`)

    const selectProps = {
        style: {
            width: "90%",
            marginTop: "12px",
        },
        showSearch: true,
        allowClear: false,
        optionFilterProp: "label",
    };

    const getQueryFieldsForRedirect = () => {
        // transform the tableData into queryFields object
        const row = { field: tableData.columns[0].dataIndex };
        const where = pageType === "player" ? { player_gsis_id: [pageID] } : { team_id: [pageID] };
        const columns = tableData.columns.slice(1).map((column) => ({ field: column.dataIndex }));
        return { row: row, where: where, columns: columns };
    };
    // NOTE: I originally tried to pass the tableData to redirect as well; the problem is that you cannot pass
    // functions to the Redirect state object (has to be serialized), and tableData contains render/sorter functions
    // Instead I am not passing tableData, only the queryFields object

    return (
        <>
            <Layout>
                <Sider {...siderProps}>
                    <Row gutter={[0, 18]}>
                        <Col span={24}>
                            {pageType === "player" ? (
                                <Select {...selectProps} onChange={onIDSelect} placeholder="Search for Players" options={playerList} />
                            ) : (
                                <Select {...selectProps} onChange={onIDSelect} placeholder="Search for Teams" options={teamList} />
                            )}
                        </Col>
                    </Row>

                    <Switch>
                        <Route path="/player/:id">
                            <LoadPage pageType={"player"} setTableData={setTableData} setRedirect={setRedirect} />
                        </Route>
                        <Route path="/team/:id">
                            <LoadPage pageType={"team"} setTableData={setTableData} setRedirect={setRedirect} />
                        </Route>
                    </Switch>
                </Sider>

                <Content style={{ margin: "0 5px" }}>
                    <Table setTableInfo={setTableInfo} tableData={tableData} />
                </Content>

                {redirect && (
                    <Redirect
                        to={{
                            pathname: "/query",
                            state: {
                                queryFields: getQueryFieldsForRedirect(),
                            },
                        }}
                    />
                )}
            </Layout>
        </>
    );
}

export default StandardPage;
