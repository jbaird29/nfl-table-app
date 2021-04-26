import { Button, Form, message, Modal } from "antd";
import React, { useState } from "react";
import { addCalcsToTable, addRenderSorterToTable, copyTableWithoutCalcs } from "../helper-functions";
import { TableData } from "../types/MainTypes";
import CustomCalcTabs from "./Custom-Calc-Tabs";
import { CustomCalcObj } from "../types/MainTypes";

interface CustomCalcProps {
    isVisible: boolean;
    setIsVisible: (arg0: boolean) => void;
    tableData: TableData;
    setTableData: (arg0: TableData) => void;
    tableInfo: any;
}

export default function CustomCalc(props: CustomCalcProps) {
    const { isVisible, setIsVisible, tableData, setTableData, tableInfo } = props;
    const initialCalcsPanes = { panes: [{ title: "Calc 1", key: "1" }], activeKey: "1", newTabIndex: 2 };

    const [calcsForm] = Form.useForm<CustomCalcObj>();
    const [calcsPanes, setCalcsPanes] = useState(initialCalcsPanes);
    const [resetCalcs, setResetCalcs] = useState(1);

    type labelAlign = "left" | "right" | undefined; // TS yells at me if I don't do this; problem with antD lib

    const calcsFormProps = {
        form: calcsForm,
        name: "calcs",
        initialValues: {},
        labelCol: { span: 12 },
        wrapperCol: { span: 12 },
        labelAlign: "left" as labelAlign,
        colon: false,
    };

    const resetCalcsForm = () => {
        setCalcsPanes(initialCalcsPanes);
        calcsForm.resetFields();
        setResetCalcs(resetCalcs + 1);
    };

    const submitCustomCalcs = () => {
        // FIRST: validate that every colIndex is in tableData
        const allColIndexes = tableData.columns
            .filter((column) => column.title.startsWith("Col"))
            .map((column) => column.children?.[0].dataIndex); // gets an array of all dataIndex strings ['col1', 'col2']
        const hasInvalidCol = Object.entries(calcsForm.getFieldsValue()).some(
            ([calcIndex, calc]) =>
                (calc.colIndex1.startsWith("col") && !allColIndexes.includes(calc.colIndex1)) ||
                (calc.colIndex2.startsWith("col") && !allColIndexes.includes(calc.colIndex2))
        );
        if (hasInvalidCol) {
            message.error({ content: "Some of these fields are no longer in the table.", duration: 2.5, style: { fontSize: "1rem" } });
            return;
        }

        // CONTINUE: if valid
        const newTableData = copyTableWithoutCalcs(tableData);
        addCalcsToTable(newTableData, calcsForm.getFieldsValue());
        addRenderSorterToTable(newTableData, tableInfo);
        setTableData(newTableData);
        setIsVisible(false);
        // setSavedCalcsFields(calcsForm.getFieldsValue());
    };

    const calcModalProps = {
        title: "Edit Custom Calculations",
        visible: isVisible,
        onOk: submitCustomCalcs,
        onCancel: () => setIsVisible(false),
        width: 750,
        style: { top: 150 },
    };

    return (
        <Modal
            {...calcModalProps}
            footer={
                <div style={{ textAlign: "right" }}>
                    <Button danger onClick={resetCalcsForm} style={{ marginRight: 2 }}>
                        Reset
                    </Button>
                    <Button onClick={() => setIsVisible(false)} style={{ marginRight: 2 }}>
                        {" "}
                        Close{" "}
                    </Button>
                    <Button type="primary" onClick={submitCustomCalcs}>
                        Submit
                    </Button>{" "}
                    {/*onClick={submitQueryFields}*/}
                </div>
            }
        >
            <Form {...calcsFormProps} key={`calcsForm_reset_${resetCalcs}`}>
                {tableData.columns.length > 0 ? (
                    <CustomCalcTabs state={calcsPanes} setState={setCalcsPanes} tableData={tableData} calcsForm={calcsForm} />
                ) : (
                    <p>Please select fields first</p>
                )}
            </Form>
        </Modal>
    );
}
