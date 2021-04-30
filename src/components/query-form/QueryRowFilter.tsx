import { Form, Select, Typography, Row, Col } from "antd";
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
    const teamWidth = 150;

    const yearLayoutProps = {
        wrapperCol: { span: 24 },
        labelCol: { span: 24 },
    };

    const positionLayoutProps = {
        wrapperCol: { span: 24 },
        labelCol: { span: 24 },
    };

    const playerLayoutProps = {
        wrapperCol: { span: 24 },
        labelCol: { span: 24 },
    };

    const teamLayoutProps = {
        wrapperCol: { span: 24 },
        labelCol: { span: 24 },
    };

    type ModeType = "multiple" | "tags" | undefined;

    const selectProps = {
        showSearch: true,
        allowClear: true,
        placeholder: "optional",
        mode: "tags" as ModeType,
        optionFilterProp: "label",
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
                <Col flex={`1 1 ${Math.max(labelWidth, yearWidth)}px`}>
                    <Form.Item name={["where", "season_year"]} label={`Specific Years`} {...yearLayoutProps} labelAlign="left">
                        <Select {...selectProps} maxTagCount="responsive" options={yearsList} />
                    </Form.Item>
                </Col>
                <Col flex={`1 1 ${Math.max(labelWidth, positionWidth)}px`}>
                    <Form.Item name={["where", "player_position"]} label={`Specific Positions`} {...positionLayoutProps} labelAlign="left">
                        <Select {...selectProps} maxTagCount="responsive" options={positionOptions} />
                    </Form.Item>
                </Col>
                <Col flex={`1 1 ${Math.max(labelWidth, playerWidth)}px`}>
                    <Form.Item name={["where", "player_gsis_id"]} label={`Specific Players`} {...playerLayoutProps} labelAlign="left">
                        <Select {...selectProps} maxTagCount="responsive" options={playerList} />
                    </Form.Item>
                </Col>
                <Col flex={`1 1 ${Math.max(labelWidth, teamWidth)}px`}>
                    <Form.Item name={["where", "team_id"]} label={`Specific Teams`} {...teamLayoutProps} labelAlign="left">
                        <Select {...selectProps} maxTagCount="responsive" options={teamList} />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
