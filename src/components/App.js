import React, { useState, useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {Layout, Button, Drawer, message, Divider, Row, Col, Form, Modal, Steps, Spin, Image, Tabs, Typography, Menu, notification } from 'antd';
import { DownloadOutlined, CloudUploadOutlined, CopyOutlined, QuestionCircleOutlined, HomeOutlined, UserOutlined, TeamOutlined, MonitorOutlined } from '@ant-design/icons';
import QueryPage from './QueryPage'
import { Switch, Route, Link, useLocation, } from 'react-router-dom';
import logo from '../images/logo.png'
import StandardPage from './standard-pages/StandardPage'

const { Header, Sider, Content, Footer } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs
const { Title, Paragraph } = Typography

function App() {
    const location = useLocation();

    function onHelp() {
        notification.open({
            duration: 2,
            description: helpMessage
        });
    };

    const helpMessage = (<>
        <Title level={5}>About</Title>
        <Paragraph style={{marginBottom: 4}}>NFL Table is a site for slicing and dicing football statistics on a play-by-play level.</Paragraph>
        <Paragraph>Interact with the data, rather being stuck with a static page.</Paragraph>
        <Title level={5}>Help</Title>
        <Paragraph style={{marginBottom: 4}}>Click Edit Query Fields in the left-hand menu to build a custom query.</Paragraph>
        <Paragraph>Select a Row Type, then Add Columns to choose statistics and filters.</Paragraph>
    </>)

    const selectedKeys = (
        location.pathname.includes('query') ? ['query'] :
        location.pathname.includes('player') ? ['player'] :
        location.pathname.includes('team') ? ['team'] :
        ['home']
    )

    return (
    <>
    <Layout style={{ minHeight: '100vh' }}>

        <Header style={{backgroundColor: '#FFF', borderBottom: '1px solid #d8d9dc', padding: '0 10px'}}>
            <Row>
            <Col span={4} style={{textAlign: 'left', padding: '10px 0px', }}>
                <Image preview={false} width={180} src={logo} alt='logo' />
            </Col>
            <Col span={16}  >
                <Menu selectedKeys={selectedKeys} mode="horizontal" style={{ backgroundColor: 'inherit', textAlign: 'center', fontSize: '1rem' }}>
                    <Menu.Item key="home" icon={<HomeOutlined />}><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item key="query" icon={<MonitorOutlined />}><Link to="/query">Custom Query</Link></Menu.Item>
                    <Menu.Item key="player" icon={<UserOutlined />}><Link to="/player">Player Stats</Link></Menu.Item>
                    <Menu.Item key="team" icon={<TeamOutlined />}><Link to="/team">Team Stats</Link></Menu.Item>
                </Menu>
            </Col>
            <Col span={4} style={{ textAlign: 'right'}}>
                <Button style={{width: 120, }} size='large' onClick={onHelp} shape="round" icon={<QuestionCircleOutlined />}>About</Button>
            </Col>
            </Row>
        </Header>

        <Switch>
            <Route exact path="/">
                <p>Welcome home.</p>
            </Route>

            <Route path="/query">
                <QueryPage />
            </Route>

            <Route path="/player">
                <StandardPage key='player-page' pageType='player' />  {/* key ensures re-render between route changes */}
            </Route>

            <Route path="/team">
                <StandardPage key='team-page' pageType='team' />
            </Route>

        </Switch>
        
    </Layout>
    
    </>
    );
}

export default App;
