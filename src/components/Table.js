import React from "react";
import { Table as AntTable } from "antd";
import "antd/dist/antd.css";

function Table(props) {
    const dataSource = props.tableData.dataSource;
    const columns = props.tableData.columns;

    const handleChange = (pagination, filters, sorter, extra) => {
        props.setTableInfo({ filters, sorter });
    };

    // if the first column is the rnk, use the second column, otherwise use first coumn
    const rowKey = columns[0]?.dataIndex === "rnk" ? columns[1].dataIndex : columns[0]?.dataIndex;

    return (
        <AntTable
            style={{ paddingTop: "5px", overflow: "initial" }}
            onChange={handleChange}
            dataSource={dataSource}
            columns={columns}
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
                y: "75vh", // 64px for header + 22px for footer
            }}
            size="small"
            showSorterTooltip={true}
            rowKey={rowKey}
            sortDirections={["descend", "ascend", "descend"]}
            className={"custom-table"}
            rowClassName={"custom-table-row"}
        />
    );
}

export default Table;
