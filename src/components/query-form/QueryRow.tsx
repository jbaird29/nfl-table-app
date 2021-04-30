import { Form, Radio } from "antd";
import QuerySectionHeader from "./QuerySectionHeader";

export default function QueryRow() {
    return (
        <>
            <QuerySectionHeader title="Select Row Type" description="Determines how the statistics are displayed" />
            <Form.Item
                label="Row Type"
                name={["row", "field"]}
                rules={[{ required: true, message: "Please select a row type." }]}
                key="row_field"
            >
                <Radio.Group key="row_field_radio">
                    <Radio value="player_name_with_position">By Player</Radio>
                    <Radio value="team_name">By Team</Radio>
                    <Radio value="season_year">By Year</Radio>
                </Radio.Group>
            </Form.Item>
        </>
    );
}
