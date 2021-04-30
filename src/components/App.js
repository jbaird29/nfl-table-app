import { useState } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Layout, Row, Col, Image, Typography, Menu } from "antd";
import { HomeOutlined, UserOutlined, TeamOutlined, MonitorOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import QueryPage from "./QueryPage.tsx";
import { Switch, Route, Link, useLocation, Redirect } from "react-router-dom";
import logo from "../images/logo-site-header.png";
import StandardPage from "./standard-pages/StandardPage";
import HomePage from "./HomePage";

const { Header } = Layout;
const { Title, Paragraph } = Typography;

function App() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

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
                        <Col xs={0} sm={3} style={{ textAlign: "left", lineHeight: "1px" }}>
                            <Image preview={false} src={logo} alt="logo" />
                        </Col>
                        <Col xs={24} sm={21}>
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
                        <HomePage />
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

                    <Route
                        path="/saves/:saveID"
                        render={({ match, location, history }) => (
                            <Redirect
                                to={{
                                    pathname: "/query",
                                    state: {
                                        saveID: match.params.saveID,
                                    },
                                }}
                            />
                        )}
                    />
                </Switch>
            </Layout>
        </>
    );
}

export default App;
