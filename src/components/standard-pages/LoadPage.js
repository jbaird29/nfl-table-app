import React, { useState, useEffect } from "react";
import { Radio, Row, Col, Typography, Divider, message, Image, Card, Avatar, Spin, Button } from 'antd';
import { UserOutlined, LoadingOutlined, FormOutlined } from '@ant-design/icons';
import { useParams, useHistory, } from 'react-router-dom';
import { addRenderSorterToTable, listOfRowTypes} from '../helper-functions'

const {Paragraph, Text} = Typography

export default function LoadPage(props) {
    const [cardLoading, setCardLoading] = useState(true)
    const [infoCard, setInfoCard] = useState(null)

    const history = useHistory();
    const {id} = useParams()
    const type = props.type   // 'player' or 'team'

    const [allPlayerData, setAllPlayerData] = useState(null)
    const [statType, setStatType] = useState(null)

    useEffect(() => {
        loadStandardPage(props.type, id)
        const cleanUp = () => {
            document.title = 'NFL Table'
            // props.setTableData({})
        }
        return cleanUp
    }, [id])

    const positionToStatType = { QB: 'pass', RB: 'rush', WR: 'recv', TE: 'recv' }

    const defaultTableInfo = {sorter: {field: null, order: null},  filters: {} }

    async function loadStandardPage(type, id) {
        const hide = message.loading({content: 'Loading the data', style: {fontSize: '1rem'}}, 0)
        setCardLoading(true)
        setStatType(null)
        const response = await fetch(`/loadStandardPage?type=${type}&id=${id}`, { method: 'GET'})
        if (response.status === 200) {
            const {tableData, info} = await response.json();
            const defaultStatType = info.player_position ? positionToStatType[info.player_position] : 'pass'
            addRenderSorterToTable(tableData, defaultTableInfo)
            setAllPlayerData(tableData)
            setStatType(defaultStatType)
            props.setSavedCalcsFields(null)
            props.setSavedQueryFields(null)
            document.title = props.type === 'player' ? `${info.full_name} Stats` : `${info.team_name} Stats`
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

    const shouldInclude = (dataIndex, statType) => dataIndex.startsWith(statType) || listOfRowTypes.includes(dataIndex)

    const filterRow = (row, statType) => Object.fromEntries(
        Object.entries(row).filter(([dataIndex, value]) => shouldInclude(dataIndex, statType))
    ) 

    // when the user selects a different stat type, filter the tableData based on that stat type
    useEffect(() => {
        if (allPlayerData && statType) {
            const newColumns = allPlayerData.columns.filter(column => shouldInclude(column.dataIndex, statType))
            const newDatasource = allPlayerData.dataSource.map(row => filterRow(row, statType))
            props.setTableData({columns: newColumns, dataSource: newDatasource})
        }
    }, [allPlayerData, statType])


    const handleOpenCustomQueryClick = () => {
        history.push('/')
        props.openStandardInCustomQuery(type, id)
    }


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

    const getTeamCard = info => (
        <Card loading={false} size='small' style={{ width: 250, margin: 'auto', }}
        cover={<Image alt={info.team_name} src={info.logo_url} />} >
        <Card.Meta title={info.team_name} description={`(${info.team_abbreviation})`} 
            style={{marginBottom: 8, marginTop: 4, lineHeight: 1.2}}
        />
        <Card.Grid hoverable={false} style={{padding: 6, width: '100%', textAlign: 'left', lineHeight: 1.5, }}>
            <Paragraph style={paragraphStyle}><Text strong>Coach:</Text> {info.coach}</Paragraph>
            <Divider style={dividerStyle} />
            <Paragraph style={paragraphStyle}><Text strong>GM:</Text> {info.general_manager}</Paragraph>
            <Divider style={dividerStyle} />
            <Paragraph style={paragraphStyle}><Text strong>Owners:</Text> {info.owners}</Paragraph>
            <Divider style={dividerStyle} />
            <Paragraph style={paragraphStyle}><Text strong>Venue:</Text> {info.venue}</Paragraph>
        </Card.Grid>
        </Card>
    )

    const getTeamLoadingCard = () => (
        <Card loading={true} size='small' style={{ width: 250, margin: 'auto', }}
        cover={<Avatar shape="square" style={{width: 250, height: 181.656}} size={181.656} icon={<LoadingOutlined />} />} />
    )

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

    const button = (
    <Spin spinning={cardLoading}>
        <Row style={{marginTop: 12}}>
            <Button style={{width: 250, margin: 'auto'}} block onClick={handleOpenCustomQueryClick} shape="round" icon={<FormOutlined />}>Open in Custom Query</Button>
        </Row>
    </Spin>
    )

    return (<>
        <Divider />
        {selectStats}
        {cardLoading && getLoadingCard()}
        {infoCard && !cardLoading && getInfoCard(type, infoCard)}
        {infoCard && !cardLoading && button}
    </>);
};
