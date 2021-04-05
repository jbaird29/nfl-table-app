import React, { useState, useEffect } from "react";
import {Radio, Row, Col, Typography, Select, Divider, message, Image, Card, List, Avatar, Menu, Dropdown, } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Switch, Route, Link, useHistory, useParams, useLocation} from 'react-router-dom';
import { addRenderSorterToTable} from '../helper-functions'
import LoadPage from './LoadPage'
import teamList from '../../inputs/teamList.json'
import playerList from '../../inputs/playerList.json'

const {Paragraph, Text} = Typography

export default function SelectPage(props) {
    const [statType, setStatType] = useState('pass')
    const history = useHistory();

    // todo - add logic for toggling between Pass / Rush / Recv stats
    // todo - add a 'position' filter before player?
    // todo - add team info card

    const onPlayerSelect = (id) => history.push(`/pages/players/${encodeURI(id)}`)
    const onTeamSelect   = (id) => history.push(`/pages/teams/${encodeURI(id)}`)

    const selectStyle = { width: '85%' }

    const menu = (
        <Menu>
          <Menu.Item key="players"><Link to="/pages/players/">Player Stats</Link></Menu.Item>
          <Menu.Item key="teams"><Link to="/pages/teams/">Team Stats</Link></Menu.Item>
        </Menu>
      );      


    return (<>
        <Row gutter={[0, 18]}>
        <Col span={24} style={{textAlign: 'center'}}>
        <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>Select a Page Type <DownOutlined /></a>
        </Dropdown>
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
                <Divider />
                <LoadPage type="player" setTableData={props.setTableData} setSavedCalcsFields={props.setSavedCalcsFields} setSavedQueryFields={props.setSavedQueryFields} />
            </Route>
            <Route path="/pages/teams/:id"> 
                <Divider />
                <LoadPage type="team" setTableData={props.setTableData} setSavedCalcsFields={props.setSavedCalcsFields} setSavedQueryFields={props.setSavedQueryFields} />
            </Route>
        </Switch>
 
    </>);
};
