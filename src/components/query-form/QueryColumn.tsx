import React from "react";
import { Form, Input, Button, Space, Select, Row, Col, Divider, Slider, InputNumber, Typography, Tooltip } from "antd";
import {
    MinusCircleOutlined,
    PlusOutlined,
    CaretUpOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import statsInputs from "../../inputs/statsInputs.json";
import filterComponents from "../../inputs/filterComponents.json";
import filterInputs from "../../inputs/filterInputs.json";
import { NamePath } from "rc-field-form/lib/interface";
import QuerySectionHeader from "./QuerySectionHeader";
const { Paragraph } = Typography;

export default function QueryColumn(props: any) {
    const [columnForm] = Form.useForm();
    const { queryForm } = props;

    interface FilterInput {
        label: string | "Passing" | "Rushing" | "Receiving" | "General";
        key: string | "pass" | "rush" | "recv" | "general";
    }

    interface FilterComponent {
        name: string;
        statType: string | "pass" | "rush" | "recv" | "general";
        formProps: {
            label: string;
            labelCol: {
                span: number;
            };
            wrapperCol: {
                span: number;
            };
        };
        ui: {
            type: string | "select" | "inputNumber" | "slider";
            props: any;
        };
        linkedAggs?: string[];
        linkedFilters?: string[];
    }

    const renderFilterComponent = (filter: FilterComponent, name: NamePath) => {
        return (
            <>
                <Col span={8}>
                    <Form.Item name={name} fieldKey={name} preserve={false}>
                        {filter.ui.type === "select" ? (
                            <Select placeholder={filter.formProps.label} {...filter.ui.props} />
                        ) : filter.ui.type === "slider" ? (
                            <Slider {...filter.ui.props} />
                        ) : filter.ui.type === "inputNumber" ? (
                            <InputNumber {...filter.ui.props} />
                        ) : null}
                    </Form.Item>
                </Col>
                <Col span={8}></Col>
            </>
        );
    };

    const checkFilterComponentUpdate = (prev: any, current: any, colNum: number, filterNum: number): boolean =>
        prev.columns?.[colNum]?.filters?.[filterNum]?.activeFilter !== current.columns?.[colNum]?.filters?.[filterNum]?.activeFilter;

    const conditionallyRenderFilterComponent = (colNum: number, filterNum: number, filter: FilterComponent) => (
        <Form.Item
            noStyle
            key={`wrapper_${colNum}_${filterNum}_${filter.name}`}
            shouldUpdate={(prev, current) => checkFilterComponentUpdate(prev, current, colNum, filterNum)}
        >
            {({ getFieldValue }) => {
                console.log("updated filters");
                return getFieldValue(["columns", colNum, "filters", filterNum, "activeFilter"]) !== filter.name
                    ? null
                    : renderFilterComponent(filter, [filterNum, filter.name]);
            }}
        </Form.Item>
    );

    const onFinish = (values: object) => {
        console.log(values);
    };

    const statInputSelectProps = {
        placeholder: "Stat Type",
        align: "center",
        showSearch: true,
        optionFilterProp: "label",
        options: statsInputs,
    };

    const filterTypeSelectProps = {
        placeholder: "Select Filter Type",
        align: "center",
        options: filterInputs, // changing the inputs based on colField was too difficult
    };

    const headerStyle = {
        color: "black",
        // border: "1px solid grey",
        // backgroundColor: "lightgrey",
    };

    return (
        <>
            <QuerySectionHeader spaceAbove title="Add Columns" description="Each corresponds to a column in the table" />
            <Row gutter={[10, 0]} style={{ marginBottom: 10, textAlign: "center" }}>
                <Col style={headerStyle} flex="80px">
                    <span># </span>
                </Col>
                <Col style={headerStyle} flex="1 1 120px">
                    <span>Select Stat Type </span>
                    <Tooltip title="prompt text">
                        <InfoCircleOutlined />
                    </Tooltip>
                </Col>
                <Col style={headerStyle} flex="1 1 120px">
                    <span>Enter Column Title </span>
                    <Tooltip title="prompt text">
                        <InfoCircleOutlined />
                    </Tooltip>
                </Col>
                <Col style={headerStyle} flex="130px">
                    <span>Minimum Value </span>
                    <Tooltip title="prompt text">
                        <InfoCircleOutlined />
                    </Tooltip>
                </Col>
                <Col style={headerStyle} flex="185px">
                    <span>Actions </span>
                    <Tooltip title="prompt text">
                        <InfoCircleOutlined />
                    </Tooltip>
                </Col>
            </Row>
            <Form.List name="columns">
                {(fields, { add, remove, move }) => (
                    <>
                        {fields.map(({ key, name: colNum, fieldKey, ...restField }) => (
                            <div style={{ position: "relative" }} key={key}>
                                <Row style={{ marginTop: 8, marginRight: 100 }} align="middle" gutter={[10, 10]}>
                                    <Col flex="80px">
                                        <Paragraph style={{ marginBottom: 0 }}>Column {colNum + 1}:</Paragraph>
                                    </Col>
                                    <Col flex="1 1 120px">
                                        <Form.Item
                                            {...restField}
                                            name={[colNum, "field"]}
                                            fieldKey={[fieldKey, "field"]}
                                            rules={[{ required: true, message: "Missing stat type" }]}
                                        >
                                            <Select style={{ width: "100%" }} {...statInputSelectProps} />
                                        </Form.Item>
                                    </Col>
                                    <Col flex="1 1 120px">
                                        <Form.Item {...restField} name={[colNum, "title"]} fieldKey={[fieldKey, "title"]}>
                                            <Input style={{ width: "100%" }} placeholder="optional" autoComplete="off" />
                                        </Form.Item>
                                    </Col>
                                    <Col flex="130px">
                                        <Form.Item {...restField} name={[colNum, "having"]} fieldKey={[fieldKey, "having"]}>
                                            <InputNumber style={{ width: "100%" }} placeholder="optional" />
                                        </Form.Item>
                                    </Col>
                                    <Col flex="80px">
                                        <Space>
                                            <ArrowUpOutlined onClick={() => move(colNum, colNum - 1)} />
                                            <ArrowDownOutlined onClick={() => move(colNum, colNum + 1)} />
                                            <MinusCircleOutlined onClick={() => remove(colNum)} />
                                        </Space>
                                    </Col>
                                </Row>

                                <Form.List name={[colNum, "filters"]}>
                                    {(fields, { add, remove }) => (
                                        <>
                                            <Form.Item noStyle>
                                                <Button
                                                    style={{ position: "absolute", right: "0px", top: "6px" }}
                                                    type="dashed"
                                                    onClick={() => add()}
                                                    icon={<PlusOutlined />}
                                                >
                                                    Filter
                                                </Button>
                                            </Form.Item>
                                            {fields.map(({ key, name: filterNum, fieldKey, ...restField }) => (
                                                <div key={key}>
                                                    <Row style={{ margin: "0 220px 0 80px" }} align="middle" gutter={[5, 5]}>
                                                        <MinusCircleOutlined
                                                            style={{ position: "absolute", left: 60 }}
                                                            onClick={() => remove(filterNum)}
                                                        />
                                                        <Col span={8}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[filterNum, "activeFilter"]}
                                                                fieldKey={[fieldKey, "activeFilter"]}
                                                            >
                                                                <Select {...filterTypeSelectProps} />
                                                            </Form.Item>
                                                        </Col>
                                                        {filterComponents.map((FilterComponent: FilterComponent) =>
                                                            conditionallyRenderFilterComponent(colNum, filterNum, FilterComponent)
                                                        )}
                                                    </Row>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                                <Divider style={{ margin: "6px 0" }} />
                            </div>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Column
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </>
    );
}
