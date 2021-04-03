import React, { useState, useEffect } from "react";
import {Radio, Row, Col, Typography, Select, Divider, message, } from 'antd';
import teamList from '../../inputs/teamList.json'
import playerList from '../../inputs/playerList.json'
import {loadStandardPage, } from '../helper-functions'

export default function SelectPage(props) {
    const [pageType, setPageType] = useState('player')
    const [statType, setStatType] = useState('pass')

    // todo - add logic for toggling between Pass / Rush / Recv stats
    // todo - add a 'position' filter before player?

    const onPlayerSelect = (player) => props.loadStandardPage('player', player) 
    const onTeamSelect = (team) => props.loadStandardPage('team', team) 

    const selectStyle = {
        width: '85%'
    }

    return (<>
        <Row gutter={[0, 18]}>
        <Col span={24} style={{textAlign: 'center'}}>
            <Radio.Group onChange={(e) => setStatType(e.target.value)} value={statType} buttonStyle="solid">
                <Radio.Button value={'pass'}>Passing</Radio.Button>
                <Radio.Button value={'rush'}>Rushing</Radio.Button>
                <Radio.Button value={'recv'}>Receiving</Radio.Button>
            </Radio.Group>
        </Col>
        </Row>

        <Row gutter={[0, 18]}>
        <Col span={24} style={{textAlign: 'center'}}>
            <Radio.Group onChange={(e) => setPageType(e.target.value)} value={pageType}>
                <Radio value={'player'}>Player Stats</Radio>
                <Radio value={'team'}>Team Stats</Radio>
            </Radio.Group>
        </Col>
        </Row>

        <Row gutter={[0, 18]}>
        <Col span={24}>
            {pageType === 'player' && <Select onChange={onPlayerSelect} style={selectStyle} showSearch={true} allowClear={true} placeholder='Players' options={playerList}/>}
            {pageType === 'team' && <Select onChange={onTeamSelect} style={selectStyle} showSearch={true} allowClear={true} placeholder='Teams' options={teamList}/>}
        </Col>
        </Row>

        <Divider />
        </>
    );
};
