import React, { useState, useEffect } from "react";
import {Radio, Row, Col, Typography, Select, Divider, message, Image, Card, List, Avatar, Menu, } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Switch, Route, Link, useHistory, useParams, useLocation} from 'react-router-dom';
import { addRenderSorterToTable} from '../helper-functions'
import LoadPage from './LoadPage'
import teamList from '../../inputs/teamList.json'
import playerList from '../../inputs/playerList.json'

const {Paragraph, Text} = Typography

export default function SelectPage(props) {
    const [statType, setStatType] = useState('pass')
    const history = useHistory();
    const location = useLocation();
    const pageType = location.pathname.includes('players') ? 'players' : 'teams'

    // todo - add logic for toggling between Pass / Rush / Recv stats
    // todo - add a 'position' filter before player?
    // todo - add team info card
    // todo - bug when I type in player, switch and type in team, and then type in player again

    const onPlayerSelect = (id) => history.push(`/pages/players/${encodeURI(id)}`)
    const onTeamSelect   = (id) => history.push(`/pages/teams/${encodeURI(id)}`)

    const selectStyle = { width: '85%' }

    // when a user switches page type, this empties tableData
    useEffect(() => {
        props.setTableData({})
    }, [pageType])

    return (<>
        <Row gutter={[0, 18]}>
        <Col span={24} style={{textAlign: 'center'}}>
            <Menu defaultSelectedKeys="players" mode="horizontal" style={{lineHeight: '1.5rem', marginBottom: 6}}>
                <Menu.Item key="players"><Link to="/pages/players/">Player Stats</Link></Menu.Item>
                <Menu.Item key="teams"><Link to="/pages/teams/">Team Stats</Link></Menu.Item>
            </Menu>
        </Col>
        </Row>

        <Row gutter={[0, 18]}>
        <Col span={24}>
            <Switch>
                <Route path="/pages/players/"
                    component={() => <Select onChange={onPlayerSelect} style={selectStyle} showSearch={true} allowClear={true} placeholder='Players' options={playerList} optionFilterProp="label"/>}
                />
                <Route path="/pages/teams/"
                    component={() => <Select onChange={onTeamSelect} style={selectStyle} showSearch={true} allowClear={true} placeholder='Teams' options={teamList} optionFilterProp="label"/>}
                />
            </Switch>
        </Col>
        </Row>

        <Divider />

        <Row gutter={[0, 18]}>
        <Col span={24} style={{textAlign: 'center'}}>
            <Radio.Group onChange={(e) => setStatType(e.target.value)} value={statType} buttonStyle="solid">
                <Radio.Button value={'pass'}>Passing</Radio.Button>
                <Radio.Button value={'rush'}>Rushing</Radio.Button>
                <Radio.Button value={'recv'}>Receiving</Radio.Button>
            </Radio.Group>
        </Col>
        </Row>

        <Switch>
            <Route path="/pages/players/:id"> 
                <LoadPage type="player" setTableData={props.setTableData} setSavedCalcsFields={props.setSavedCalcsFields} setSavedQueryFields={props.setSavedQueryFields} />
            </Route>
            <Route path="/pages/teams/:id"> 
                <LoadPage type="team" setTableData={props.setTableData} setSavedCalcsFields={props.setSavedCalcsFields} setSavedQueryFields={props.setSavedQueryFields} />
            </Route>
        </Switch>
 
    </>);
};
