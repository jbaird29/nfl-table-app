import React from "react";
import { Form, Select, Typography, Space } from "antd";
import teamList from "../../inputs/teamList.json";
import playerList from "../../inputs/playerList.json";
import { yearsList } from "../helper-functions";
import QuerySectionHeader from "./QuerySectionHeader";

const { Paragraph } = Typography;

export default function QueryRowFilter() {
    // renderFilterObject takes filter, name, key as parameters

    const formItemProps = {
        labelCol: { flex: "200px" },
        wrapperCol: { flex: "300px" },
    };

    type ModeType = "multiple" | "tags" | undefined;

    const selectProps = {
        showSearch: true,
        allowClear: true,
        placeholder: "optional",
        mode: "multiple" as ModeType,
        optionFilterProp: "label",
    };

    return (
        <>
            <QuerySectionHeader spaceAbove title="Add Row Filters" description="Filter the resulting rows of the dataset" />

            <Space>
                <Form.Item name={["where", "season_year"]} label={`Specific Years`} {...formItemProps} labelAlign="left">
                    <Select {...selectProps} options={yearsList} />
                </Form.Item>

                <Form.Item name={["where", "team_id"]} label={`Specific Teams`} {...formItemProps} labelAlign="left">
                    <Select {...selectProps} options={teamList} />
                </Form.Item>

                <Form.Item name={["where", "player_gsis_id"]} label={`Specific Players`} {...formItemProps} labelAlign="left">
                    <Select style={{ width: "250px" }} {...selectProps} options={playerList} />
                </Form.Item>
            </Space>
        </>
    );
}
