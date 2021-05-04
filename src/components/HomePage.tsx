import { Divider, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { MonitorOutlined } from "@ant-design/icons";
import { Content } from "antd/lib/layout/layout";
import HighlightCard, { HighlightCardProps } from "./home-pages/HighlightCard";

const { Paragraph, Title } = Typography;

export default function HomePage() {
    const cards: HighlightCardProps[] = [
        {
            title: "Jalen Hurts",
            value: 4.6,
            precision: 1,
            suffix: "%",
            description: "Effect of Throwaways on CMP %",
            url: "/saves/21mmcjzpkzgzxe7f8hkf",
            imageURL: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4040715.png",
        },
        {
            title: "Patrick Mahomes",
            value: 94.8,
            precision: 1,
            suffix: "%",
            description: "Rush YDS came from Scrambles",
            url: "/saves/p51keepwn29gfpv107kh",
            imageURL: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/3139477.png",
        },
        {
            title: "Tom Brady",
            value: 88.3,
            precision: 1,
            suffix: "",
            description: "Passer Rating while under Blitz",
            url: "/saves/qmrggvfmweemuynud9a7",
            imageURL: "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/2330.png",
        },
    ];

    return (
        <Content style={{ textAlign: "center", margin: "40px auto" }}>
            <Title level={4}>About this Site</Title>
            <Paragraph style={{ margin: "10px 10px" }}>
                NFL Table is a site for slicing and dicing football statistics on a play-by-play level. Interact with the data, rather being
                stuck with a static page.
            </Paragraph>
            <Paragraph style={{ margin: "10px 10px" }}>
                Click on{" "}
                <strong>
                    <Link to="/query">
                        <MonitorOutlined /> Custom Query
                    </Link>{" "}
                </strong>
                and use the <strong>Edit Query Fields</strong> button to get started. Add <strong>Custom Calcs</strong> to perform simple
                mathematical operations on the data.
            </Paragraph>
            <Divider />
            <Title level={4}>Not Sure Where to Get Started?</Title>
            <Paragraph style={{ marginBottom: 12 }}>Check out some of these links:</Paragraph>
            <Row style={{ margin: "0 10px" }}>
                {cards.map((cardProps, index) => (
                    <HighlightCard key={index} {...cardProps} />
                ))}
            </Row>
        </Content>
    );
}
