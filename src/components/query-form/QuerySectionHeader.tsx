import React from "react";
import { Form, Radio, Typography, Row, Col, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Paragraph, Title } = Typography;

interface QuerySectionHeaderProps {
    title: string;
    description: string;
    spaceAbove?: boolean;
}

export default function QuerySectionHeader({ title, description, spaceAbove }: QuerySectionHeaderProps) {
    const paragraphStyle = {
        marginBottom: "4px",
    };

    const headerStyle = {
        marginBottom: "12px",
        marginTop: spaceAbove ? "36px" : "0px",
        padding: "2px",
        backgroundColor: "#d8d9dc",
        border: "1px solid grey",
    };

    return (
        <>
            <Row align="top" style={headerStyle}>
                <Col style={{ textAlign: "center" }} span={24}>
                    <Paragraph style={paragraphStyle} strong>
                        {title}{" "}
                        <Tooltip title={description}>
                            <InfoCircleOutlined />
                        </Tooltip>
                    </Paragraph>
                </Col>
                {/* <Col style={{ textAlign: "right" }} span={2}>
                </Col> */}
            </Row>
        </>
    );
}
