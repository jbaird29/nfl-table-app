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
    Space,
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
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import QueryPage from "./QueryPage.tsx";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import logo from "../images/logo-site-header.png";
import StandardPage from "./standard-pages/StandardPage";

const { Header, Sider, Content, Footer } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

function App() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // use this for the Home page instead
    function onHelp() {
        notification.open({
            duration: 2,
            description: helpMessage,
        });
    }

    const helpMessage = (
        <>
            <Title level={5}>About</Title>
            <Paragraph style={{ marginBottom: 4 }}>
                NFL Table is a site for slicing and dicing football statistics on a play-by-play level.
            </Paragraph>
            <Paragraph>Interact with the data, rather being stuck with a static page.</Paragraph>
            <Title level={5}>Help</Title>
            <Paragraph style={{ marginBottom: 4 }}>Click Edit Query Fields in the left-hand menu to build a custom query.</Paragraph>
            <Paragraph>Select a Row Type, then Add Columns to choose statistics and filters.</Paragraph>
        </>
    );

    const selectedKeys = location.pathname.includes("query")
        ? ["query"]
        : location.pathname.includes("player")
        ? ["player"]
        : location.pathname.includes("team")
        ? ["team"]
        : ["home"];

    const siderProps = {
        width: 300,
        collapsible: true,
        collapsed: collapsed,
        onCollapse: (collapsed, type) => setCollapsed(collapsed),
        collapsedWidth: 0,
        theme: "light",
        trigger: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
        style: { backgroundColor: "#FFF", textAlign: "center", borderRight: "1px solid #d8d9dc" },
        zeroWidthTriggerStyle: {
            backgroundColor: "#FFF",
            border: "1px solid #d8d9dc",
            top: "92%",
            zIndex: 3,
        },
    };

    return (
        <>
            <Layout style={{ minHeight: "100vh" }}>
                <Header style={{ backgroundColor: "#FFF", borderBottom: "1px solid #d8d9dc", padding: "0 10px" }}>
                    <Row align="middle">
                        <Col span={4} xs={0} sm={4} style={{ textAlign: "left", lineHeight: "1px" }}>
                            <Image preview={false} src={logo} alt="logo" />
                        </Col>
                        <Col span={20} xs={24} sm={20}>
                            <Menu
                                selectedKeys={selectedKeys}
                                mode="horizontal"
                                style={{ backgroundColor: "inherit", textAlign: "center", fontSize: "0.85rem" }}
                            >
                                <Menu.Item key="home" icon={<HomeOutlined />}>
                                    <Link to="/">Home</Link>
                                </Menu.Item>
                                <Menu.Item key="query" icon={<MonitorOutlined />}>
                                    <Link to="/query">Custom Query</Link>
                                </Menu.Item>
                                <Menu.Item key="player" icon={<UserOutlined />}>
                                    <Link to="/player">Player Stats</Link>
                                </Menu.Item>
                                <Menu.Item key="team" icon={<TeamOutlined />}>
                                    <Link to="/team">Team Stats</Link>
                                </Menu.Item>
                            </Menu>
                        </Col>
                    </Row>
                </Header>

                <Switch>
                    <Route exact path="/">
                        <p>Welcome home.</p>
                    </Route>

                    <Route path="/query">
                        <QueryPage siderProps={siderProps} />
                    </Route>

                    <Route path="/player">
                        <StandardPage siderProps={siderProps} key="player-page" pageType="player" />{" "}
                        {/* key ensures re-render between route changes */}
                    </Route>

                    <Route path="/team">
                        <StandardPage siderProps={siderProps} key="team-page" pageType="team" />
                    </Route>
                </Switch>
            </Layout>
        </>
    );
}

export default App;
