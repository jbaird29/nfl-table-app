import React, { useState, useEffect } from 'react';
import {Select, Layout, Button, Drawer, message, Divider, Row, Col, Form, Modal, Steps, Spin, Image, Tabs, Typography, Menu, notification } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Switch, Route, Link, useHistory, } from 'react-router-dom';
import Table from '../Table'
import LoadPage from './LoadPage'
import teamList from '../../inputs/teamList.json'
import playerList from '../../inputs/playerList.json'

const { Header, Sider, Content, Footer } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs
const { Title, Paragraph } = Typography

function StandardPage(props) {
    const [tableData, setTableData] = useState({});
    const [tableInfo, setTableInfo] = useState( {sorter: {field: null, order: null},  filters: {} })

    const history = useHistory();

    const onPlayerSelect = (id) => history.push(`/player/${encodeURI(id)}`)
    const onTeamSelect   = (id) => history.push(`/team/${encodeURI(id)}`)

    const selectProps = { 
        style: { 
            width: '90%',
            marginTop: '12px'
        },
        showSearch: true,
        allowClear: true,
        optionFilterProp: 'label'
    }
    
    return (<>
        <Layout>
            <Sider width={300} style={{backgroundColor: '#FFF', textAlign: 'center', borderRight: '1px solid #d8d9dc', }}>
                <Row gutter={[0, 18]}>
                <Col span={24}>
                    {props.pageType === 'player' 
                    ? <Select {...selectProps} onChange={onPlayerSelect} placeholder='Search for Players' options={playerList} />
                    : <Select {...selectProps} onChange={onTeamSelect} placeholder='Search for Teams' options={teamList} />}
                </Col>
                </Row>

                <Switch>
                    <Route path="/player/:id" >
                        <LoadPage pageType={'player'} setTableData={setTableData} />
                    </Route>
                    <Route path="/team/:id" >
                        <LoadPage pageType={'team'} setTableData={setTableData} />
                    </Route>
                </Switch>
            </Sider>

            <Content style={{margin: '0 5px'}}>
                {!tableData.columns 
                ? <Footer style={{ textAlign: 'center', height: '22', padding: '20px 0px'}}>NFL Table ©{new Date().getFullYear()} Created by Jon Baird</Footer>
                : <Table setTableInfo={setTableInfo} tableData={tableData} />
                }
            </Content>

        </Layout>
    </>);
}

export default StandardPage;
