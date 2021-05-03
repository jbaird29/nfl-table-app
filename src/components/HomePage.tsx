import { Card, Col, Divider, Row, Statistic, Typography } from "antd";
import { Link } from "react-router-dom";
import { MonitorOutlined } from "@ant-design/icons";

const { Paragraph, Title } = Typography;

export default function HomePage() {
    const emoji = <span style={{ fontSize: "1.2rem" }}>{String.fromCodePoint(0x1f448)}</span>;

    interface StatCardProps {
        title: string;
        value: number;
        precision: number;
        suffix: string;
        description: string;
        url: string;
    }

    const renderCard = (props: StatCardProps) => {
        return (
            <Col flex="1 1 200px">
                <Card size="default" title={props.title}>
                    <Statistic value={props.value} precision={props.precision} valueStyle={{ color: "black" }} suffix={props.suffix} />
                    <Paragraph>{props.description}</Paragraph>
                    <Link to={props.url}>Click Here {emoji}</Link>
                </Card>
            </Col>
        );
    };

    const cards: StatCardProps[] = [
        {
            title: "Jalen Hurts",
            value: 4.6,
            precision: 1,
            suffix: "%",
            description: "Throwaways Effect on CMP %",
            url: "/saves/21mmcjzpkzgzxe7f8hkf",
        },
        {
            title: "Patrick Mahomes",
            value: 94.8,
            precision: 1,
            suffix: "%",
            description: "Rush YDS came from Scrambles",
            url: "/saves/p51keepwn29gfpv107kh",
        },
        {
            title: "Tom Brady",
            value: 88.3,
            precision: 1,
            suffix: "",
            description: "Passer Rating while under Blitz",
            url: "/saves/qmrggvfmweemuynud9a7",
        },
    ];

    return (
        <>
            <div style={{ textAlign: "center", margin: "50px auto" }}>
                <Title level={4}>About</Title>
                <Paragraph style={{ margin: "10px 10px" }}>
                    NFL Table is a site for slicing and dicing football statistics on a play-by-play level. Interact with the data, rather
                    being stuck with a static page.
                </Paragraph>
                <Paragraph style={{ margin: "10px 10px" }}>
                    Click on{" "}
                    <strong>
                        <Link to="/query">
                            <MonitorOutlined /> Custom Query
                        </Link>{" "}
                    </strong>
                    and use the <strong>Edit Query Fields</strong> button to get started. Add <strong>Custom Calcs</strong> to perform
                    simple mathematical operations on the data.
                </Paragraph>
                <Divider />
                <Title level={4}>Not Sure Where to Get Started?</Title>
                <Paragraph style={{ marginBottom: 12 }}>Check out some of these links:</Paragraph>
                <Row style={{ margin: "0 10px" }}>{cards.map((card) => renderCard(card))}</Row>
            </div>
        </>
    );
}
