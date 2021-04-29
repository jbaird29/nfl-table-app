import React, { useState, useEffect } from "react";
import { Button, Drawer, message, Form, DrawerProps, FormInstance } from "antd";
import QueryColumn from "./QueryColumn";
import QueryRow from "./QueryRow";
import QueryRowFilter from "./QueryRowFilter";
import { QueryFields, TableData, TableColumn, TableRow, CalcsFields } from "../types/MainTypes";
import { addRenderSorterToTable } from "../helper-functions";

interface QueryProps {
    isVisible: boolean;
    setIsVisible: (arg0: boolean) => void;
    setTableData: (arg0: TableData) => void;
    initialTableData: TableData;
    initialTableInfo: any;
    queryForm: FormInstance;
    setSavedQueryFields: (arg0: QueryFields | null) => void;
    setSavedCalcsFields: (arg0: CalcsFields | null) => void;
}

export default function QueryForm(props: QueryProps) {
    const { isVisible, setIsVisible, setTableData, initialTableData, initialTableInfo } = props;
    const { queryForm, setSavedQueryFields, setSavedCalcsFields } = props;

    // queryForm
    const [resetQuery, setResetQuery] = useState(1);

    const fieldDrawerProps: DrawerProps = {
        title: "Edit Query Fields",
        width: "min(100%, 900px)",
        visible: isVisible,
        placement: "left",
        onClose: () => setIsVisible(false),
        bodyStyle: { paddingBottom: 24, paddingLeft: 12, paddingRight: 12 },
    };

    const queryFormProps = {
        form: queryForm,
        name: "query",
        initialValues: { row: { field: "player_name_with_position" }, columns: [{}] },
        colon: false,
    };

    const resetQueryForm = () => {
        queryForm.resetFields();
        setResetQuery(resetQuery + 1);
        setTableData(initialTableData);
    };

    const onSubmit = async () => {
        queryForm
            .validateFields()
            // .then((values: Query) => console.log(values))
            .then((values: QueryFields) => submitQueryAndSetData(values))
            .catch((errorInfo) => {
                console.log(errorInfo);
                message.error({ content: "Enter required values, or remove fields.", duration: 2.5, style: { fontSize: "1rem" } });
            });
    };

    const showErrorMessage = (): void => {
        message.error({
            content: "An error occurred. Please refresh the page and try again.",
            duration: 5,
            style: { fontSize: "1rem" },
        });
    };

    const submitQuery = async (
        query: QueryFields
    ): Promise<{
        tableData?: TableData;
        error?: any;
    }> => {
        try {
            const fetchOptions = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(query) };
            const response = await fetch(`/runQuery`, fetchOptions);
            if (!response.ok) {
                const error = await response.json();
                return { error: error };
            } else {
                const tableData = await response.json();
                return { tableData: tableData };
            }
        } catch (err) {
            return { error: err };
        }
    };

    const submitQueryAndSetData = async (query: QueryFields) => {
        const hide = message.loading({ content: "Loading the data", style: { fontSize: "1rem" } }, 0);
        const { tableData, error } = await submitQuery(query);
        hide();
        if (error) {
            showErrorMessage();
            setTableData(initialTableData);
            setSavedQueryFields(null);
            console.log(error);
        } else if (tableData) {
            addRenderSorterToTable(tableData, initialTableInfo);
            setTableData(tableData);
            setSavedQueryFields(query);
            setSavedCalcsFields(null);
            setIsVisible(false);
        }
    };

    return (
        <>
            <Drawer
                {...fieldDrawerProps}
                footer={
                    <div style={{ textAlign: "right" }}>
                        <Button danger onClick={resetQueryForm} style={{ marginRight: 8 }}>
                            Reset
                        </Button>
                        <Button onClick={() => setIsVisible(false)} style={{ marginRight: 8 }}>
                            {" "}
                            Close{" "}
                        </Button>
                        <Button type="primary" onClick={() => onSubmit()}>
                            {" "}
                            Submit{" "}
                        </Button>{" "}
                    </div>
                }
            >
                <Form {...queryFormProps} key={`queryForm_reset_${resetQuery}`}>
                    <QueryRow />
                    <QueryRowFilter />
                    <QueryColumn form={queryForm} />
                </Form>
            </Drawer>
        </>
    );
}
