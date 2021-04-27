import { Button, Drawer, DrawerProps, Form, message, Modal } from "antd";
import React, { useState } from "react";
import { addCalcsToTable, addRenderSorterToTable, copyTableWithoutCalcs } from "../helper-functions";
import { TableData } from "../types/MainTypes";
import CustomCalcTabs from "./Custom-Calc-Tabs";
import { CustomCalcObj } from "../types/MainTypes";
import CustomCalcFields from "./CustomCalcFields";

interface CustomCalcProps {
    isVisible: boolean;
    setIsVisible: (arg0: boolean) => void;
    tableData: TableData;
    setTableData: (arg0: TableData) => void;
    tableInfo: any;
}

export default function CustomCalcForm(props: CustomCalcProps) {
    const { isVisible, setIsVisible, tableData, setTableData, tableInfo } = props;
    const [calcsForm] = Form.useForm();
    const [resetCalcs, setResetCalcs] = useState(1);

    type labelAlign = "left" | "right" | undefined; // TS yells at me if I don't do this; problem with antD lib

    const calcsFormProps = {
        form: calcsForm,
        name: "calcs",
        initialValues: {},
        labelCol: { flex: "200px" },
        wrapperCol: { flex: "auto" },
        labelAlign: "left" as labelAlign,
        colon: false,
    };

    const resetCalcsForm = () => {
        calcsForm.resetFields();
        setResetCalcs(resetCalcs + 1);
        const newTableData = copyTableWithoutCalcs(tableData);
        addRenderSorterToTable(newTableData, tableInfo);
        setTableData(newTableData);
    };

    // TODO - form validation (that all required fields are filled out)
    const submitCustomCalcs = () => {
        const calculations = calcsForm.getFieldValue(["calculations"]) as CustomCalcObj[];
        if (!calculations) {
            return;
        }
        console.log(calculations);
        // FIRST: validate that every colIndex is in tableData
        const allColIndexes = tableData.columns
            .filter((column) => column.title.startsWith("Col"))
            .map((column) => column.children?.[0].dataIndex); // gets an array of all dataIndex strings ['col1', 'col2']
        const hasInvalidCol = calculations.some(
            (calc: CustomCalcObj) =>
                (calc.colIndex1.startsWith("col") && !allColIndexes.includes(calc.colIndex1)) ||
                (calc.colIndex2.startsWith("col") && !allColIndexes.includes(calc.colIndex2))
        ); // returns false if either colIndex1 or colIndex2 is inot the the list of all dataIndex strings
        if (hasInvalidCol) {
            message.error({ content: "Some of these fields are no longer in the table.", duration: 2.5, style: { fontSize: "1rem" } });
            return;
        }

        // CONTINUE: if valid
        const newTableData = copyTableWithoutCalcs(tableData);
        addCalcsToTable(newTableData, calculations);
        addRenderSorterToTable(newTableData, tableInfo);
        setTableData(newTableData);
        setIsVisible(false);
        // setSavedCalcsFields(calcsForm.getFieldsValue());
    };

    const calcsDrawerProps: DrawerProps = {
        title: "Edit Custom Calculations",
        width: "min(100%, 550px)",
        visible: isVisible,
        placement: "left",
        onClose: () => setIsVisible(false),
        bodyStyle: { paddingBottom: 24, paddingLeft: 12, paddingRight: 12 },
    };

    return (
        <Drawer
            {...calcsDrawerProps}
            footer={
                <div style={{ textAlign: "right" }}>
                    <Button danger onClick={resetCalcsForm} style={{ marginRight: 8 }}>
                        Reset
                    </Button>
                    <Button onClick={() => setIsVisible(false)} style={{ marginRight: 8 }}>
                        {" "}
                        Close{" "}
                    </Button>
                    <Button type="primary" onClick={() => submitCustomCalcs()}>
                        Submit
                    </Button>{" "}
                    {/*onClick={submitQueryFields}*/}
                </div>
            }
        >
            <Form {...calcsFormProps} key={`calcsForm_reset_${resetCalcs}`}>
                {tableData.columns.length > 0 ? (
                    <CustomCalcFields tableData={tableData} calcsForm={calcsForm} />
                ) : (
                    <p>Please select fields first</p>
                )}
            </Form>
        </Drawer>
    );
}
