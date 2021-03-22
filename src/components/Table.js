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
      scroll={{ x: 230, y: '75vh' }}
      size="small"
      showSorterTooltip={true}
      sortDirections={['descend', 'ascend', 'descend']}
      rowKey={columns[1].dataIndex}   // this will make the row field (i.e. player_name) the rowKey
      className={'custom-table'}
      rowClassName={'custom-table-row'}
    />
  )
}

export default Table