import React, { useState, useEffect } from "react";
import { Radio, Row, Col, Typography, Select, Divider, message, Image, Card, List, Avatar, Menu, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useParams} from 'react-router-dom';
import { addRenderSorterToTable} from '../helper-functions'

const {Paragraph, Text} = Typography

export default function LoadPage(props) {
    const [cardLoading, setCardLoading] = useState(true)
    const [infoCard, setInfoCard] = useState(null)
    const {id} = useParams()
    const type = props.type

    const [allPlayerData, setAllPlayerData] = useState(null)
    const [statType, setStatType] = useState(null)

    useEffect(() => {
        loadStandardPage(type, id)
    }, [id])

    const positionToStatType = { QB: 'pass', RB: 'rush', WR: 'recv', TE: 'recv' }

    async function loadStandardPage(type, id) {
        const hide = message.loading({content: 'Loading the data', style: {fontSize: '1rem'}}, 0)
        setCardLoading(true)
        setStatType(null)
        const response = await fetch(`/loadStandardPage?type=${type}&id=${id}`, { method: 'GET'})
        if (response.status === 200) {
            const {tableData, info} = await response.json();
            const defaultStatType = info.player_position ? positionToStatType[info.player_position] : 'pass'
            addRenderSorterToTable(tableData)
            setAllPlayerData(tableData)
            setStatType(defaultStatType)                 // next: set dynamically based on position
            props.setSavedCalcsFields(null)
            props.setSavedQueryFields(null)
            hide()
            setCardLoading(false)
            setInfoCard(info)
            return null
        } else {
            message.error({content: 'An error occurred. Please refresh the page and try again.', duration: 5, style: {fontSize: '1rem'} })
            hide()
            setCardLoading(false)
            return null
        }
    }

    // NOTE: If I add other possible row types, include them here
    const rowTypes = ['season_year', 'player_name_with_position', 'team_name']
    const shouldInclude = (dataIndex, statType) => dataIndex.startsWith(statType) || rowTypes.includes(dataIndex)

    const filterRow = (row, statType) => Object.fromEntries(
        Object.entries(row).filter(([dataIndex, value]) => shouldInclude(dataIndex, statType))
    ) 

    useEffect(() => {
        if (allPlayerData && statType) {
            const newColumns = allPlayerData.columns.filter(column => shouldInclude(column.dataIndex, statType))
            const newDatasource = allPlayerData.dataSource.map(row => filterRow(row, statType))
            props.setTableData({columns: newColumns, dataSource: newDatasource})
        }
    }, [allPlayerData, statType])


    const paragraphStyle = { margin: '4px 0'}
    const dividerStyle = { margin: '0'}

    const getPlayerLoadingCard = () => (
        <Card loading={true} size='small' style={{ width: 250, margin: 'auto', }}
        cover={<Avatar shape="square" style={{width: 250, height: 181.656}} size={181.656} icon={<UserOutlined />} />} />
    )

    const getPlayerCard = info => (
        <Card loading={false} size='small' style={{ width: 250, margin: 'auto', }}
        cover={<Image alt={info.full_name} src={info.headshot_url} />} >
        <Card.Meta title={info.full_name} description={`${info.team_name} (${info.team_abbreviation})`} 
            style={{marginBottom: 8, marginTop: 4, lineHeight: 1.2}}
        />
        <Card.Grid hoverable={false} style={{padding: 6, width: '100%', textAlign: 'left', lineHeight: 1.5, }}>
            <Paragraph style={paragraphStyle}><Text strong>Height:</Text> {info.height}</Paragraph>
            <Divider style={dividerStyle} />
            <Paragraph style={paragraphStyle}><Text strong>Weight:</Text> {info.weight}</Paragraph>
            <Divider style={dividerStyle} />
            <Paragraph style={paragraphStyle}><Text strong>Jersey:</Text> {info.jersey_number}</Paragraph>
            <Divider style={dividerStyle} />
            <Paragraph style={paragraphStyle}><Text strong>College:</Text> {info.college}</Paragraph>
            <Divider style={dividerStyle} />
            <Paragraph style={paragraphStyle}><Text strong>DOB:</Text> {info.birth_date.value} ({info.age})</Paragraph>
        </Card.Grid>
        </Card>
    )

    const getTeamCard = info => (<div>Test</div>)

    const getTeamLoadingCard = () => (<div>Test</div>)

    const getInfoCard = (type, info) => (type === 'player' ? getPlayerCard(info) : getTeamCard(info))

    const getLoadingCard = () => (type === 'player' ? getPlayerLoadingCard() : getTeamLoadingCard())

    const selectStats = (
        <Spin spinning={cardLoading}>
        <Col style={{marginBottom: 16}}>
        <Radio.Group onChange={(e) => setStatType(e.target.value)} value={statType} buttonStyle="solid">
            <Radio.Button value={'pass'}>Passing</Radio.Button>
            <Radio.Button value={'rush'}>Rushing</Radio.Button>
            <Radio.Button value={'recv'}>Receiving</Radio.Button>
        </Radio.Group>
        </Col>
        </Spin>
    )

    return (<>
        {selectStats}
        {cardLoading && getLoadingCard()}
        {infoCard && !cardLoading && getInfoCard(type, infoCard)}
    </>);
};
