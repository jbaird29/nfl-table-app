import React from "react";
import { Row, Col, Typography, Select, Menu, Dropdown, } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Switch, Route, Link, useHistory, } from 'react-router-dom';
import LoadPage from './LoadPage'
import teamList from '../../inputs/teamList.json'
import playerList from '../../inputs/playerList.json'


export default function SelectPage(props) {
    const history = useHistory();

    const onPlayerSelect = (id) => history.push(`/pages/players/${encodeURI(id)}`)
    const onTeamSelect   = (id) => history.push(`/pages/teams/${encodeURI(id)}`)

    const selectProps = { 
        style: { width: '85%' },
        showSearch: true,
        allowClear: true,
        optionFilterProp: 'label'
    }


    const menu = (
        <Menu style={{textAlign: 'center', width: '85%', margin: 'auto', }}>
          <Menu.Item key="players"><Link to="/pages/players/">Player Stats</Link></Menu.Item>
          <Menu.Item key="teams"><Link to="/pages/teams/">Team Stats</Link></Menu.Item>
        </Menu>
    );

    const getLoadPageEl = (type) => (
        <LoadPage type={type} openStandardInCustomQuery={props.openStandardInCustomQuery} setTableData={props.setTableData} 
            setSavedCalcsFields={props.setSavedCalcsFields} setSavedQueryFields={props.setSavedQueryFields} 
        />
    );

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
                    component={() => <Select {...selectProps} onChange={onPlayerSelect} placeholder='Players' options={playerList} />}
                />
                <Route path="/pages/teams/"
                    component={() => <Select {...selectProps} onChange={onTeamSelect} placeholder='Teams' options={teamList} />}
                />
            </Switch>
        </Col>
        </Row>

        <Switch>
            <Route path="/pages/players/:id" >
                {getLoadPageEl('player')}
            </Route>
            <Route path="/pages/teams/:id" >
                {getLoadPageEl('team')}
            </Route>
        </Switch>
 
    </>);
};
