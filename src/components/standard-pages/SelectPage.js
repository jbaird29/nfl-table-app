import React, { useState, useEffect } from "react";
import {Radio, Row, Col, Typography, Select, Divider, message, } from 'antd';
import teamList from '../../inputs/teamList.json'
import playerList from '../../inputs/playerList.json'
import {addRenderSorterToTable} from '../helper-functions'

export default function SelectPage(props) {
    const [pageType, setPageType] = useState('player')
    const [statType, setStatType] = useState('pass')

    // todo - add logic for toggling between Pass / Rush / Recv stats
    // todo - add a 'position' filter before player?

    const onPlayerSelect = (player) => getData('player', player) 
    const onTeamSelect = (team) => getData('team', team) 

    const getData = async (rowType, row) => {
        const hide = message.loading({content: 'Loading the data', style: {fontSize: '1rem'}}, 0)
        const response = await fetch(`/loadStandardPage?rowType=${rowType}&row=${row}`, { method: 'GET'})
        if (response.status === 200) {
            const tableData = await response.json();
            addRenderSorterToTable(tableData)
            props.setTableData(tableData)
            props.setSavedCalcsFields(null)
            props.setSavedQueryFields(null)
            hide()
        } else {
            message.error({content: 'An error occurred. Please refresh the page and try again.', duration: 5, style: {fontSize: '1rem'} })
            hide()
        }
    }

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
