import React from "react";
import { Table as AntTable } from 'antd';
import 'antd/dist/antd.css';


function Table(props) {
  const dataSource = props.tableData.dataSource
  const columns = props.tableData.columns

  return (
    <AntTable
      style={{ overflow: 'initial'}}
      dataSource={dataSource}
      columns={columns}
      pagination={{   // https://ant.design/components/pagination/#API
        pageSize: 2000,
        hideOnSinglePage: true,
        position: ["bottomRight"],
        size: "small"
      }} 
      bordered
      scroll={{ x: 175, y: '75vh' }}
      size="small"
      showSorterTooltip={true}
      sortDirections={['descend', 'ascend', 'descend']}
      rowKey='player_name'
      className={'custom-table'}
      rowClassName={'custom-table-row'}
    />
  )
}

export default Table