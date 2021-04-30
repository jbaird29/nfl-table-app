import React from "react";
import { Card, Col, Divider, Row, Statistic, Typography } from "antd";
import { Link } from "react-router-dom";

const { Paragraph, Title, Text } = Typography;

export default function HomePage() {
    return (
        <>
            <div style={{ textAlign: "center", margin: "auto" }}>
                <Title level={4}>About</Title>
                <Paragraph style={{ marginBottom: 6 }}>
                    NFL Table is a site for slicing and dicing football statistics on a play-by-play level.
                </Paragraph>
                <Paragraph style={{ marginBottom: 6 }}>Interact with the data, rather being stuck with a static page.</Paragraph>
                <Divider />
                <Title level={4}>Help</Title>
                <Paragraph style={{ marginBottom: 6 }}>
                    Click on <strong>Custom Query</strong> and use the <strong>Edit Query Fields</strong> button in the left-hand menu.
                </Paragraph>
                <Paragraph style={{ marginBottom: 6 }}>Add Custom Calcs to perform simple mathematical operations on the data.</Paragraph>
                <Divider />
                <Title level={4}>Not Sure Where to Get Started?</Title>
                <Paragraph style={{ marginBottom: 12 }}>Check out some of these links:</Paragraph>
                <Row>
                    <Col>
                        <Card size="small" title="Jalen Hurts" style={{ width: 200 }}>
                            <Statistic value={"4.6"} precision={1} valueStyle={{ color: "black" }} suffix="%" />
                            <Paragraph>Throwaways Effect on CMP %</Paragraph>
                            <Link to="/saves/21mmcjzpkzgzxe7f8hkf">Click Here</Link>
                        </Card>
                    </Col>
                    <Col>
                        <Card size="small" title="Patrick Mahomes" style={{ width: 200 }}>
                            <Statistic value={"94.8"} precision={1} valueStyle={{ color: "black" }} suffix="%" />
                            <Paragraph>Rush YDS came from Scrambles</Paragraph>
                            <Link to="/saves/p51keepwn29gfpv107kh">Click Here</Link>
                        </Card>
                    </Col>
                    <Col>
                        <Card size="small" title="Tom Brady" style={{ width: 200 }}>
                            <Statistic value={"88.3"} precision={1} valueStyle={{ color: "black" }} />
                            <Paragraph>Passer Rating while under Blitz</Paragraph>
                            <Link to="/saves/qmrggvfmweemuynud9a7">Click Here</Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}
