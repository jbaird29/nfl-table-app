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
    const history = useHistory();

    const onPlayerSelect = (id) => history.push(`/pages/players/${encodeURI(id)}`)
    const onTeamSelect   = (id) => history.push(`/pages/teams/${encodeURI(id)}`)

    const selectStyle = { width: '85%' }

    const menu = (
        <Menu style={{textAlign: 'center', width: '85%', margin: 'auto', }}>
          <Menu.Item key="players"><Link to="/pages/players/">Player Stats</Link></Menu.Item>
          <Menu.Item key="teams"><Link to="/pages/teams/">Team Stats</Link></Menu.Item>
        </Menu>
      );      

    const getLoadPageEl = (type) => (
        <LoadPage type={type} openStandardInCustomQuery={props.openStandardInCustomQuery} setTableData={props.setTableData} 
            setSavedCalcsFields={props.setSavedCalcsFields} setSavedQueryFields={props.setSavedQueryFields} />
    )

    return (<>
        <Row gutter={[0, 18]}>
        <Col span={24} style={{textAlign: 'center'}}>
        <Dropdown overlay={menu}>
            <Row>
            <a onClick={e => e.preventDefault()} className="ant-dropdown-link"  style={{width: '85%', margin: 'auto', }} >Select a Page Type <DownOutlined /></a>
            </Row>
        </Dropdown>
        </Col>
        </Row>

        <Row gutter={[0, 18]}>
        <Col span={24}>
            <Switch>
                <Route path="/pages/players/"
                    children={() => <Select onChange={onPlayerSelect} style={selectStyle} showSearch={true} allowClear={true} placeholder='Players' options={playerList} optionFilterProp="label"/>}
                />
                <Route path="/pages/teams/"
                    children={() => <Select onChange={onTeamSelect} style={selectStyle} showSearch={true} allowClear={true} placeholder='Teams' options={teamList} optionFilterProp="label"/>}
                />
            </Switch>
        </Col>
        </Row>

        <Switch>
            <Route path="/pages/players/:id" 
                children={() => getLoadPageEl('player')}
            /> 
            <Route path="/pages/teams/:id" 
                children={() => getLoadPageEl('team')}
            /> 
        </Switch>
 
    </>);
};
