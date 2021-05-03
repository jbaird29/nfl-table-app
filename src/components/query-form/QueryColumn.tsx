import { CSSProperties } from "react";
import { Form, Input, Button, Space, Select, Divider, Slider, InputNumber, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import statsInputs from "../../inputs/statsInputs.json";
import filterComponents from "../../inputs/filterComponents.json";
import filterInputs from "../../inputs/filterInputs.json";
import { NamePath } from "rc-field-form/lib/interface";
import QuerySectionHeader from "./QuerySectionHeader";
const { Text } = Typography;

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
                <div style={{ display: "inline-block", verticalAlign: "middle" }}>
                    <Form.Item
                        style={{ display: "inline-block", width: 250, verticalAlign: "middle" }}
                        name={name}
                        fieldKey={name}
                        preserve={true}
                        rules={[{ required: true, message: "Missing filter value" }]}
                    >
                        {filter.ui.type === "select" ? (
                            <Select placeholder={filter.formProps.label} {...filter.ui.props} />
                        ) : filter.ui.type === "slider" ? (
                            <Slider {...filter.ui.props} />
                        ) : filter.ui.type === "inputNumber" ? (
                            <InputNumber {...filter.ui.props} />
                        ) : null}
                    </Form.Item>
                </div>
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
        style: {
            width: 250,
        },
    };

    const widths = {
        colNum: 80,
        statType: 280,
        title: 190,
        minValue: 100,
        actions: 70,
        filter: 95,
    };

    const colStyle = {
        display: "inline-block",
        padding: "5px 5px",
    };

    const colDividerStyle: CSSProperties = {
        margin: "8px 0",
        borderTop: "1px dotted rgba(0, 0, 0, 0.07)",
    };

    return (
        <>
            <QuerySectionHeader spaceAbove title="Add Columns" description="Each corresponds to a column in the table" />
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
                                    <Text style={{ marginBottom: 0 }}>Column {colNum + 1}:</Text>
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
                                                    <Button type="default" onClick={() => add()} icon={<PlusOutlined />}>
                                                        Filter
                                                    </Button>
                                                </Form.Item>
                                            </div>
                                            {fields.map(({ key, name: filterNum, fieldKey, ...restField }) => (
                                                <div key={key} style={{ margin: "12px 0" }}>
                                                    <div style={{ ...colStyle, width: widths.colNum, textAlign: "right" }}>
                                                        <Text style={{ marginBottom: 0, marginRight: 6, verticalAlign: "middle" }}>
                                                            Filter:
                                                        </Text>
                                                    </div>

                                                    <div style={{ display: "inline-block", verticalAlign: "middle" }}>
                                                        <MinusCircleOutlined
                                                            style={{ margin: "0 10px 0 0", verticalAlign: "middle" }}
                                                            onClick={() => remove(filterNum)}
                                                        />
                                                    </div>
                                                    <div style={{ display: "inline-block" }}>
                                                        <Form.Item
                                                            {...restField}
                                                            style={{
                                                                display: "inline-block",
                                                                verticalAlign: "middle",
                                                                margin: "0 10px 0 0",
                                                            }}
                                                            name={[filterNum, "activeFilter"]}
                                                            fieldKey={[fieldKey, "activeFilter"]}
                                                            rules={[{ required: true, message: "Missing filter type" }]}
                                                        >
                                                            <Select {...filterTypeSelectProps} />
                                                        </Form.Item>
                                                        {filterComponents.map((FilterComponent: FilterComponent) =>
                                                            conditionallyRenderFilterComponent(colNum, filterNum, FilterComponent)
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                                <Divider style={colDividerStyle} />
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
