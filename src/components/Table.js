import React, { useState } from "react";
import { Table as AntTable } from 'antd';
import 'antd/dist/antd.css';
import Column from "antd/lib/table/Column";


function Table(props) {
  const dataSource = props.tableData.dataSource

  const columns = props.tableData.columns
 
  // const columns = [
  //   {
  //     title: 'Player',
  //     dataIndex: 'player_name',
  //     width: '150px',
  //     sorter: (a, b) => a.player_name - b.player_name,
  //   },
  //   {
  //     title: 'Pass Yards 2020',
  //     dataIndex: 'sum_yds__pass__2020',
  //     width: '100px',
  //   },
  //   {
  //     title: 'Pass Yards 2019',
  //     dataIndex: 'sum_yds__pass__2019',
  //     width: '100px',
  //   },
  //   {
  //     title: 'Pass Yards 2018',
  //     dataIndex: 'sum_yds__pass__2018',
  //     width: '100px',
  //   },
  //   {
  //     title: 'Rush Yards 2020',
  //     dataIndex: 'sum_yds__rush__2020',
  //     width: '100px',
  //   },
  //   {
  //     title: 'Rush Yards 2019',
  //     dataIndex: 'sum_yds__rush__2019',
  //     width: '100px',
  //   },
  //   {
  //     title: 'Rush Yards 2018',
  //     dataIndex: 'sum_yds__rush__2018',
  //     width: '100px',
  //   },
  //   {
  //     title: 'Receiving Yards 2020',
  //     dataIndex: 'sum_yds__recv__2020',
  //     width: '100px',
  //     defaultSortOrder: 'descend',
  //     sorter: (a, b) => a.sum_yds__recv__2020 - b.sum_yds__recv__2020,
  //   },
  //   {
  //     title: 'Receiving Yards 2019',
  //     dataIndex: 'sum_yds__recv__2019',
  //     width: '100px',
  //   },
  //   {
  //     title: 'Receiving Yards 2018',
  //     dataIndex: 'sum_yds__recv__2018',
  //     width: '100px',
  //   },
  // ] 

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