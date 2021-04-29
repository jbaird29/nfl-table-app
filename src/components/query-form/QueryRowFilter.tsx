import React from "react";
import { Form, Select, Typography, Space, Row, Col } from "antd";
import teamList from "../../inputs/teamList.json";
import playerList from "../../inputs/playerList.json";
import { yearsList } from "../helper-functions";
import QuerySectionHeader from "./QuerySectionHeader";

const { Paragraph } = Typography;

export default function QueryRowFilter() {
    const labelWidth = 150;
    const yearWidth = 100;
    const positionWidth = 100;
    const playerWidth = 250;
    const temaWidth = 150;

    const yearLayoutProps = {
        wrapperCol: { flex: `1 1 ${yearWidth}px` },
    };

    const positionLayoutProps = {
        wrapperCol: { flex: `1 1 ${positionWidth}px` },
    };

    const playerLayoutProps = {
        wrapperCol: { flex: `1 1 ${playerWidth}px` },
    };

    const teamLayoutProps = {
        wrapperCol: { flex: `1 1 ${temaWidth}px` },
    };

    type ModeType = "multiple" | "tags" | undefined;

    const selectProps = {
        showSearch: true,
        allowClear: true,
        placeholder: "optional",
        mode: "multiple" as ModeType,
        optionFilterProp: "label",
        labelCol: {
            flex: `1 1 ${labelWidth}`,
        },
    };

    const positionOptions = [
        { align: "left", label: "QB", value: "QB", key: "QB" },
        { align: "left", label: "RB", value: "RB", key: "RB" },
        { align: "left", label: "WR", value: "WR", key: "WR" },
        { align: "left", label: "TE", value: "TE", key: "TE" },
    ];

    return (
        <>
            <QuerySectionHeader spaceAbove title="Add Row Filters" description="Filter the resulting rows of the dataset" />
            <Row gutter={[8, 8]}>
                <Col flex={`1 1 ${Math.max(labelWidth, yearWidth)}`}>
                    <Form.Item name={["where", "season_year"]} label={`Specific Years`} {...yearLayoutProps} labelAlign="left">
                        <Select {...selectProps} options={yearsList} />
                    </Form.Item>
                </Col>
                <Col flex={`1 1 ${Math.max(labelWidth, positionWidth)}`}>
                    <Form.Item name={["where", "player_position"]} label={`Specific Positions`} {...positionLayoutProps} labelAlign="left">
                        <Select {...selectProps} options={positionOptions} />
                    </Form.Item>
                </Col>
                <Col flex={`1 1 ${Math.max(labelWidth, playerWidth)}`}>
                    <Form.Item name={["where", "player_gsis_id"]} label={`Specific Players`} {...playerLayoutProps} labelAlign="left">
                        <Select {...selectProps} options={playerList} />
                    </Form.Item>
                </Col>
                <Col flex={`1 1 ${Math.max(labelWidth, temaWidth)}`}>
                    <Form.Item name={["where", "team_id"]} label={`Specific Teams`} {...teamLayoutProps} labelAlign="left">
                        <Select {...selectProps} options={teamList} />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
