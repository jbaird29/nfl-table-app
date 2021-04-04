import React, { useState, useEffect } from "react";
import {Radio, Row, Col, Typography, Select, Divider, message, Image, Card, List, Avatar, } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import teamList from '../../inputs/teamList.json'
import playerList from '../../inputs/playerList.json'

const {Paragraph, Text} = Typography

export default function SelectPage(props) {
    const [pageType, setPageType] = useState('player')
    const [statType, setStatType] = useState('pass')

    // todo - add logic for toggling between Pass / Rush / Recv stats
    // todo - add a 'position' filter before player?
    // todo - add team info card
    // todo - need to make pageType a global state and set it upon page-load

    const onPlayerSelect = (playerGSISid) => props.loadStandardPage('player', playerGSISid) 
    const onTeamSelect = (teamID) => props.loadStandardPage('team', teamID) 

    const selectStyle = { width: '85%' }
    const paragraphStyle = { margin: '4px 0'}
    const dividerStyle = { margin: '0'}

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
            {pageType === 'player' && <Select onChange={onPlayerSelect} style={selectStyle} showSearch={true} allowClear={true} placeholder='Players' options={playerList} optionFilterProp="label"/>}
            {pageType === 'team' && <Select onChange={onTeamSelect} style={selectStyle} showSearch={true} allowClear={true} placeholder='Teams' options={teamList} optionFilterProp="label"/>}
        </Col>
        </Row>

        <Divider />

        {pageType === 'player' && props.infoCard && <>
            <Card loading={props.cardLoading} size='small' style={{ width: 250, margin: 'auto', }}
                cover={props.cardLoading 
                ? <Avatar shape="square" style={{width: 250, height: 181.656}} size={181.656} icon={<UserOutlined />} />
                : <Image alt={props.infoCard.full_name} src={props.infoCard.headshot_url} />} >
                <Card.Meta title={props.infoCard.full_name} description={`${props.infoCard.team_name} (${props.infoCard.team_abbreviation})`} 
                    style={{marginBottom: 8, marginTop: 4, lineHeight: 1.2}}
                />
                <Card.Grid hoverable={false} style={{padding: 6, width: '100%', textAlign: 'left', lineHeight: 1.5, }}>
                    <Paragraph style={paragraphStyle}><Text strong>Height:</Text> {props.infoCard.height}</Paragraph>
                    <Divider style={dividerStyle} />
                    <Paragraph style={paragraphStyle}><Text strong>Weight:</Text> {props.infoCard.weight}</Paragraph>
                    <Divider style={dividerStyle} />
                    <Paragraph style={paragraphStyle}><Text strong>Jersey:</Text> {props.infoCard.jersey_number}</Paragraph>
                    <Divider style={dividerStyle} />
                    <Paragraph style={paragraphStyle}><Text strong>College:</Text> {props.infoCard.college}</Paragraph>
                    <Divider style={dividerStyle} />
                    <Paragraph style={paragraphStyle}><Text strong>DOB:</Text> {props.infoCard.birth_date.value} ({props.infoCard.age})</Paragraph>
                </Card.Grid>
            </Card>
        </>}

 
    </>);
};
