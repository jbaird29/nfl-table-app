import React from "react";
import { Table as AntTable, Typography } from "antd";
import "antd/dist/antd.css";
import { TableData, TableColumn, TableRow, TableInfo } from "./types/MainTypes";
import { SorterResult } from "antd/lib/table/interface";

const { Text } = Typography;

interface TableComponentProps {
    tableData: TableData;
    setTableInfo: (arg0: TableInfo) => void;
}

function Table(props: TableComponentProps) {
    const dataSource = props.tableData.dataSource;
    const columns = props.tableData.columns;
    const queryTitle = props.tableData.queryTitle;

    const handleChange = (pagination: any, filters: any, sorter: SorterResult<TableRow> | SorterResult<TableRow>[], extra: any) => {
        // not using filters yet but might in the future
        props.setTableInfo({ filters, sorter });
    };

    // if the first column is the rnk, use the second column, otherwise use first coumn
    const rowKey = columns[0]?.dataIndex === "rnk" ? columns[1].dataIndex : columns[0]?.dataIndex;

    return (
        <>
            <AntTable
                style={{ paddingTop: "5px", overflow: "initial" }}
                onChange={handleChange}
                dataSource={dataSource}
                columns={columns}
                title={queryTitle ? () => <Text strong>{queryTitle}</Text> : undefined}
                pagination={{
                    // https://ant.design/components/pagination/#API
                    pageSize: 2000,
                    hideOnSinglePage: true,
                    position: ["bottomRight"],
                    size: "small",
                }}
                bordered
                scroll={{
                    x: 230,
                    y: "calc(100vh - 200px)",
                }}
                size="small"
                showSorterTooltip={true}
                rowKey={rowKey}
                sortDirections={["descend", "ascend", "descend"]}
                className={"custom-table"}
                rowClassName={"custom-table-row"}
            />
        </>
    );
}

export default Table;
