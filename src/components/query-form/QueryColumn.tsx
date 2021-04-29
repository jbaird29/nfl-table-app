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
const { Paragraph, Text } = Typography;

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
                    <Form.Item name={name} fieldKey={name} preserve={true} rules={[{ required: true, message: "Missing filter value" }]}>
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
                // console.log("updated filters");
                return getFieldValue(["columns", colNum, "filters", filterNum, "activeFilter"]) !== filter.name
                    ? null
                    : renderFilterComponent(filter, [filterNum, filter.name]);
            }}
        </Form.Item>
    );

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
        showSearch: true,
        options: filterInputs, // changing the inputs based on colField was too difficult
    };

    const headerStyle = {
        color: "black",
        // border: "1px solid grey",
        // backgroundColor: "lightgrey",
    };

    const widths = {
        colNum: 80,
        statType: 280,
        title: 190,
        minValue: 100,
        actions: 70,
        filter: 95,
    };

    const wrappers = {
        colNum: `1 1 ${widths.colNum}px`,
        statType: `3 3 ${widths.statType}px`,
        title: `2 2 ${widths.title}px`,
        minValue: `1 1 ${widths.minValue}px`,
        actions: `1 1 ${widths.actions}px`,
    };

    const colStyle = {
        display: "inline-block",
        padding: "5px 5px",
    };

    return (
        <>
            <QuerySectionHeader spaceAbove title="Add Columns" description="Each corresponds to a column in the table" />
            {/* <Row gutter={[10, 0]} style={{ marginBottom: 10, textAlign: "center" }}>
                <Col style={headerStyle} flex="80px">
                    <span># </span>
                </Col>
                <Col style={headerStyle} flex="3 3 120px">
                    <span>Select Stat Type </span>
                    <Tooltip title="prompt text">
                        <InfoCircleOutlined />
                    </Tooltip>
                </Col>
                <Col style={headerStyle} flex="2 2 120px">
                    <span>Column Title (Optional) </span>
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
            </Row> */}
            <Form.List name="columns">
                {(fields, { add, remove, move }) => (
                    <>
                        {fields.map(({ key, name: colNum, fieldKey, ...restField }) => (
                            <div key={key}>
                                <div
                                    style={{
                                        ...colStyle,
                                        width: widths.colNum,
                                        verticalAlign: `${colNum !== 0 ? "middle" : "bottom"}`,
                                        paddingBottom: `${colNum !== 0 ? 5 : 10}px`,
                                    }}
                                >
                                    {/* verticalAlign: `${colNum !== 0 ? 0 : -180}%`  */}
                                    {/* <Form.Item
                                        label={colNum !== 0 ? null : "Column #"}
                                        labelAlign="left"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                    > */}
                                    <Text strong style={{ marginBottom: 0 }}>
                                        Column {colNum + 1}:
                                    </Text>
                                    {/* </Form.Item> */}
                                </div>
                                <div style={{ ...colStyle, width: widths.statType }}>
                                    <Form.Item
                                        label={colNum !== 0 ? null : "Stat Type"}
                                        labelAlign="left"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        {...restField}
                                        name={[colNum, "field"]}
                                        fieldKey={[fieldKey, "field"]}
                                        rules={[{ required: true, message: "Missing stat type" }]}
                                    >
                                        <Select style={{ width: "100%" }} {...statInputSelectProps} />
                                    </Form.Item>
                                </div>
                                <div style={{ ...colStyle, width: widths.title }}>
                                    <Form.Item
                                        label={colNum !== 0 ? null : "Column Title"}
                                        labelAlign="left"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        {...restField}
                                        name={[colNum, "title"]}
                                        fieldKey={[fieldKey, "title"]}
                                    >
                                        <Input style={{ width: "100%" }} placeholder="(optional)" autoComplete="off" />
                                    </Form.Item>
                                </div>
                                <div style={{ ...colStyle, width: widths.minValue }}>
                                    <Form.Item
                                        label={colNum !== 0 ? null : "Min Value"}
                                        labelAlign="left"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        {...restField}
                                        name={[colNum, "having"]}
                                        fieldKey={[fieldKey, "having"]}
                                    >
                                        <InputNumber style={{ width: "100%" }} placeholder="(optional)" />
                                    </Form.Item>
                                </div>
                                <div style={{ ...colStyle, width: widths.actions }}>
                                    <Form.Item
                                        label={colNum !== 0 ? null : "Actions"}
                                        labelAlign="left"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                    >
                                        <Space>
                                            <ArrowUpOutlined onClick={() => move(colNum, colNum - 1)} />
                                            <ArrowDownOutlined onClick={() => move(colNum, colNum + 1)} />
                                            {fields.length > 1 ? <MinusCircleOutlined onClick={() => remove(colNum)} /> : null}
                                        </Space>
                                    </Form.Item>
                                </div>

                                <Form.List name={[colNum, "filters"]}>
                                    {(fields, { add, remove }) => (
                                        <>
                                            <div style={{ ...colStyle, width: widths.filter }}>
                                                <Form.Item
                                                    label={colNum !== 0 ? null : "Add Filter"}
                                                    labelAlign="left"
                                                    labelCol={{ span: 24 }}
                                                    wrapperCol={{ span: 24 }}
                                                >
                                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                        Filter
                                                    </Button>
                                                </Form.Item>
                                            </div>
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
                                                                rules={[{ required: true, message: "Missing filter type" }]}
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
                            <Button onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Column
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </>
    );
}
