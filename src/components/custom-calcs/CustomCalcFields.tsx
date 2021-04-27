import React from "react";
import { Button, Form, Input, Select, FormInstance, Divider, Space, Typography, Row } from "antd";
import { CustomCalcObj, TableData, TableColumn } from "../types/MainTypes";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface CustomCalcFieldsProps {
    calcsForm: FormInstance;
    tableData: TableData;
}

export default function CustomCalcFields(props: CustomCalcFieldsProps) {
    const { calcsForm, tableData } = props;

    // this makes an array like: [{label "Col 1: Pass Yards 2020, value: "col1"}, {...}]
    const colsInTableForSelect =
        tableData.columns.length === 0
            ? []
            : tableData.columns
                  .filter((column: TableColumn) => typeof column.children !== "undefined" && column.title.startsWith("Col"))
                  .map((column: TableColumn) => ({
                      label: `${column.title}: ${column.children?.[0].title}`,
                      value: column.children?.[0].dataIndex as string, // need to tell TS this will not be undefined
                  }));

    //                 // only includes Calculations that have a lower CalcIndex than the current one;
    //     // because Calculations are added sequentially to TableData; so later calcs can only draw from earlier ones
    //     .concat(
    //     Object.entries(calcsForm.getFieldsValue() as CustomCalcObj[])
    //         .filter(([calcIndex, calc]) => calcIndex.slice(4) < props.calcIndex.slice(4))
    //         .sort((a, b) => a[0].slice(4) - b[0].slice(4))
    //         .map(([calcIndex, calc]) => ({ label: `Calc ${calcIndex.slice(4)}: ${calc.title}`, value: calcIndex }))
    // )

    const formattingStyle = {
        marginBottom: 12,
    };

    const colSelectProps = {
        style: formattingStyle,
        placeholder: "column",
        align: "center",
    };

    const operationSelectProps = {
        style: formattingStyle,
        placeholder: "operation",
        align: "center",
        options: [
            { label: "(+) Add", value: "+" },
            { label: "(-) Subtract", value: "-" },
            { label: "(*) Mulitply", value: "*" },
            { label: "(/) Divide", value: "/" },
        ],
    };

    const formatSelectProps = {
        style: formattingStyle,
        placeholder: "format",
        align: "center",
        options: [
            { label: "Number (0)", value: "dec_0" },
            { label: "Number (0.0)", value: "dec_1" },
            { label: "Number (0.00)", value: "dec_2" },
            { label: "Percent (%)", value: "percent" },
        ],
    };

    return (
        <Form.List name="calculations">
            {(fields, { add, remove, move }) => (
                <>
                    {fields.map(({ key, name: calcNum, fieldKey, ...restField }) => {
                        const calculations = (calcsForm.getFieldValue(["calculations"]) as CustomCalcObj[]) || [];
                        const selectOptions = colsInTableForSelect.concat(
                            calculations
                                .filter((calc: CustomCalcObj | undefined, index: number) => index < calcNum && calc && calc.title)
                                .map((calc: CustomCalcObj, index: number) => ({
                                    label: `Calc ${index + 1}: ${calc.title}`,
                                    value: `calc${index + 1}`,
                                }))
                        );
                        return (
                            <div key={key}>
                                <Space align="baseline" style={{ marginBottom: 8 }}>
                                    <MinusCircleOutlined onClick={() => remove(calcNum)} />
                                    <Typography.Title level={5}>{`Calculation ${calcNum + 1}`}</Typography.Title>
                                </Space>
                                <Form.Item
                                    required
                                    rules={[{ required: true, message: "Missing column choice" }]}
                                    name={[calcNum, "colIndex1"]}
                                    fieldKey={[fieldKey, "colIndex1"]}
                                    label="Select First Column"
                                    {...restField}
                                >
                                    <Select {...colSelectProps} options={selectOptions} />
                                </Form.Item>

                                <Form.Item
                                    required
                                    rules={[{ required: true, message: "Missing operation" }]}
                                    name={[calcNum, "operation"]}
                                    fieldKey={[fieldKey, "operation"]}
                                    label="Select Operation type"
                                    {...restField}
                                >
                                    <Select {...operationSelectProps} />
                                </Form.Item>

                                <Form.Item
                                    required
                                    rules={[{ required: true, message: "Missing column choice" }]}
                                    name={[calcNum, "colIndex2"]}
                                    fieldKey={[fieldKey, "colIndex2"]}
                                    label="Select Second Column"
                                    {...restField}
                                >
                                    <Select {...colSelectProps} options={selectOptions} />
                                </Form.Item>

                                <Form.Item
                                    required
                                    rules={[{ required: true, message: "Missing format" }]}
                                    name={[calcNum, "format"]}
                                    fieldKey={[fieldKey, "format"]}
                                    label="Select Formatting Type"
                                    {...restField}
                                >
                                    <Select {...formatSelectProps} />
                                </Form.Item>

                                <Form.Item
                                    required
                                    rules={[{ required: true, message: "Missing title" }]}
                                    name={[calcNum, "title"]}
                                    fieldKey={[fieldKey, "title"]}
                                    label="Input a Name"
                                    {...restField}
                                >
                                    <Input autoComplete="off" placeholder="column title" style={{ textAlign: "center" }} />
                                </Form.Item>
                                <Divider />
                            </div>
                        );
                    })}
                    <Button onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Calculation
                    </Button>
                </>
            )}
        </Form.List>
    );
}
