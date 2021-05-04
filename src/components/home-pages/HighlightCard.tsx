import { Card, Col, Statistic, Typography } from "antd";
import { Link } from "react-router-dom";
import { CSSProperties } from "react";

const { Paragraph } = Typography;

export interface HighlightCardProps {
    title: string;
    value: number;
    precision: number;
    suffix: string;
    description: string;
    url: string;
    imageURL: string;
}

export default function HighlighCard(props: HighlightCardProps) {
    const emoji = <span style={{ fontSize: "1.2rem" }}>{String.fromCodePoint(0x1f448)}</span>;

    const cardColStyle: CSSProperties = {
        margin: 10,
    };

    const valueStyle: CSSProperties = {
        color: "black",
        fontSize: "1.7rem",
    };

    return (
        <Col flex="1 1 200px" style={cardColStyle}>
            <Card
                size="small"
                style={{ border: "1px solid #d8d9dc" }}
                title={
                    <>
                        <img style={{ width: "160px", margin: "0 auto" }} alt={props.title} src={props.imageURL} />
                        <Paragraph style={{ marginTop: 8 }}>{props.title}</Paragraph>
                    </>
                }
            >
                <Statistic value={props.value} precision={props.precision} valueStyle={valueStyle} suffix={props.suffix} />
                <Paragraph>{props.description}</Paragraph>
                <Link to={props.url}>Click Here {emoji}</Link>
            </Card>
        </Col>
    );
}
