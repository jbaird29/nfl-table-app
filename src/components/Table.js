import React from "react";
import { Table as AntTable } from 'antd';
import 'antd/dist/antd.css';


function Table(props) {
  const dataSource = props.tableData.dataSource
  const columns = props.tableData.columns

  return (
    <AntTable 
      dataSource={dataSource}
      columns={columns}
      pagination={{   // https://ant.design/components/pagination/#API
        pageSize: 100, 
        hideOnSinglePage: false, 
        position: ["bottomRight"],
        size: "small"
      }} 
      bordered
      scroll={{ y: 500 }}
      size={"small"}
      showSorterTooltip={true}
      sortDirections={['descend', 'ascend', 'descend']}
      rowKey='player_name'
    />
  )
}

export default Table