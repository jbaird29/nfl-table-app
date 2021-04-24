import React from "react";
import { Form, Input, Button, Space, Select, Row, Divider, Slider, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined, CaretUpOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import statsInputs from "../../inputs/statsInputs.json";
import filterComponents from "../../inputs/filterComponents.json";
import filterInputs from "../../inputs/filterInputs.json";
import { NamePath } from "rc-field-form/lib/interface";

export default function QueryColumn() {
    const [columnForm] = Form.useForm();

    interface FilterInput {
        label: string | "Passing" | "Rushing" | "Receiving" | "General";
        key: string | "pass" | "rush" | "recv" | "general";
    }

    interface FilterComponent {
        name: string;
        statType: string | "pass" | "rush" | "recv" | "general";
        formProps: {
            label: string;
            labelCol: object;
            wrapperCol: object;
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
            <Form.Item {...filter.formProps} name={name} fieldKey={name} preserve={false}>
                {filter.ui.type === "select" ? (
                    <Select {...filter.ui.props} />
                ) : filter.ui.type === "slider" ? (
                    <Slider {...filter.ui.props} />
                ) : filter.ui.type === "inputNumber" ? (
                    <InputNumber {...filter.ui.props} />
                ) : null}
            </Form.Item>
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
        style: { width: 200 },
        placeholder: "Stat Type",
        align: "center",
        showSearch: true,
        optionFilterProp: "label",
        options: statsInputs,
    };

    const filterTypeSelectProps = {
        style: { width: 200 },
        placeholder: "Select Filter Type",
        align: "center",
        options: filterInputs, // changing the inputs based on colField was too difficult
    };

    const testSetFields = {
        columns: [
            {
                field: "pass_completions_sum",
                title: "COMP",
                filters: [
                    {
                        field: "season_year",
                        value: "2020",
                    },
                ],
            },
            {
                field: "pass_incompletions_sum",
                title: "IN COMP",
            },
        ],
    };

    const testFields = () => {
        columnForm.setFieldsValue(testSetFields);
    };

    return (
        <Form form={columnForm} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
            <Form.List name="columns">
                {(fields, { add, remove, move }) => (
                    <>
                        {fields.map(({ key, name: colNum, fieldKey, ...restField }) => (
                            <div key={key}>
                                <Space style={{ marginTop: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[colNum, "field"]}
                                        fieldKey={[fieldKey, "field"]}
                                        rules={[{ required: true, message: "Missing stat type" }]}
                                        label={`Column ${colNum + 1}`}
                                    >
                                        <Select {...statInputSelectProps} />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[colNum, "title"]} fieldKey={[fieldKey, "title"]}>
                                        <Input placeholder="Column Title (Optional)" autoComplete="off" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[colNum, "having"]} fieldKey={[fieldKey, "having"]}>
                                        <InputNumber placeholder="Min (Optional)" />
                                    </Form.Item>

                                    <ArrowUpOutlined onClick={() => move(colNum, colNum - 1)} />
                                    <ArrowDownOutlined onClick={() => move(colNum, colNum + 1)} />
                                    <MinusCircleOutlined onClick={() => remove(colNum)} />
                                </Space>
                                <Form.List name={[colNum, "filters"]}>
                                    {(fields, { add, remove }) => (
                                        <>
                                            <Form.Item noStyle>
                                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                    Filter
                                                </Button>
                                            </Form.Item>
                                            {fields.map(({ key, name: filterNum, fieldKey, ...restField }) => (
                                                <div key={key}>
                                                    <Space style={{ marginLeft: 62 }} align="baseline">
                                                        <MinusCircleOutlined onClick={() => remove(filterNum)} />
                                                        <Form.Item
                                                            {...restField}
                                                            name={[filterNum, "activeFilter"]}
                                                            fieldKey={[fieldKey, "activeFilter"]}
                                                        >
                                                            <Select {...filterTypeSelectProps} />
                                                        </Form.Item>
                                                        {filterComponents.map((FilterComponent: FilterComponent) =>
                                                            conditionallyRenderFilterComponent(colNum, filterNum, FilterComponent)
                                                        )}
                                                    </Space>
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
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
            <Button onClick={testFields}>Test</Button>
        </Form>
    );
}
