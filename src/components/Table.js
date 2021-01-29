import React, { useState } from "react";
import { Table as AntTable } from 'antd';
import 'antd/dist/antd.css';


function Table(props) {
      const columns = [
        {
          title: 'Player',
          dataIndex: 'dimension',
          sorter: (a, b) => a.dimension < b.dimension ? -1 : 1
        },
        {
          title: 'Passing Yards',
          dataIndex: 'measure',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.measure - b.measure
        },
      ];   

    const dataSource = props.data;

    return (
        // https://ant.design/components/table/#API
        <AntTable 
            dataSource={dataSource} 
            columns={columns} 
            pagination={{   // https://ant.design/components/pagination/#API
                pageSize: 100, 
                hideOnSinglePage: false, 
                position: ["bottomRight"],
                size: "small"
            }} 
            scroll={{ y: 500 }}
            size={"small"}
            showSorterTooltip={true}
            sortDirections={["ascend", "descend"]}
            rowKey="dimension"
        />
    )
}

export default Table