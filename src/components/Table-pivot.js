import React, { useState } from "react";
import { Table as AntTable } from 'antd';
import 'antd/dist/antd.css';
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";


function TablePivot(props) {
  const dataSource = [
    {
      "player_name": "Deshaun Watson",
      "2020__pass_yards": "4823.0",
      "2020__pass_attemps": "544.0",
      "2020__pass_yards_per_attempt": "8.9",
      "2020__rush_yards": "444.0",
      "2020__rush_attemps": "90.0",
      "2020__rush_yards_per_attempt": "4.9",
      "2019__pass_yards": "3852.0",
      "2019__pass_attemps": "495.0",
      "2019__pass_yards_per_attempt": "7.8",
      "2019__rush_yards": "413.0",
      "2019__rush_attemps": "82.0",
      "2019__rush_yards_per_attempt": "5.0",
      "2018__pass_yards": "4165.0",
      "2018__pass_attemps": "505.0",
      "2018__pass_yards_per_attempt": "8.2",
      "2018__rush_yards": "551.0",
      "2018__rush_attemps": "99.0",
      "2018__rush_yards_per_attempt": "5.6"
    },
    {
      "player_name": "Patrick Mahomes II",
      "2020__pass_yards": "4740.0",
      "2020__pass_attemps": "588.0",
      "2020__pass_yards_per_attempt": "8.1",
      "2020__rush_yards": "308.0",
      "2020__rush_attemps": "62.0",
      "2020__rush_yards_per_attempt": "5.0",
      "2019__pass_yards": "4031.0",
      "2019__pass_attemps": "484.0",
      "2019__pass_yards_per_attempt": "8.3",
      "2019__rush_yards": "218.0",
      "2019__rush_attemps": "43.0",
      "2019__rush_yards_per_attempt": "5.1",
      "2018__pass_yards": "5097.0",
      "2018__pass_attemps": "580.0",
      "2018__pass_yards_per_attempt": "8.8",
      "2018__rush_yards": "272.0",
      "2018__rush_attemps": "60.0",
      "2018__rush_yards_per_attempt": "4.5"

    },
    {
      "player_name": "Tom Brady",
      "2020__pass_yards": "4633.0",
      "2020__pass_attemps": "610.0",
      "2020__pass_yards_per_attempt": "7.6",
      "2020__rush_yards": "6.0",
      "2020__rush_attemps": "30.0",
      "2020__rush_yards_per_attempt": "0.2",
      "2019__pass_yards": "4057.0",
      "2019__pass_attemps": "613.0",
      "2019__pass_yards_per_attempt": "6.6",
      "2019__rush_yards": "34.0",
      "2019__rush_attemps": "26.0",
      "2019__rush_yards_per_attempt": "1.3",
      "2018__pass_yards": "4355.0",
      "2018__pass_attemps": "570.0",
      "2018__pass_yards_per_attempt": "7.6",
      "2018__rush_yards": "35.0",
      "2018__rush_attemps": "23.0",
      "2018__rush_yards_per_attempt": "1.5"
    },
  ]

  
  return (
    <AntTable 
      dataSource={dataSource}
      pagination={{   // https://ant.design/components/pagination/#API
        pageSize: 100, 
        hideOnSinglePage: false, 
        position: ["bottomRight"],
        size: "small"
      }} 
      bordered
      scroll={{ x: 2000, y: 500 }}
      size={"small"}
      showSorterTooltip={true}
      sortDirections={["ascend", "descend"]}
    >
      <Column title='Player' fixed='left' dataIndex='player_name' sorter={(a, b) => a.player_name < b.player_name ? -1 : 1} />
      <ColumnGroup title='Passing'>
        <ColumnGroup title='2020'>
          <Column width='100px' title='Yards' dataIndex='2020__pass_yards' />
          <Column width='100px' title='Attempts' dataIndex='2020__pass_attemps' />
          <Column width='100px' title='Average' dataIndex='2020__pass_yards_per_attempt' />
        </ColumnGroup>
        <ColumnGroup title='2019'>
          <Column width='100px' title='Yards' dataIndex='2019__pass_yards' />
          <Column width='100px' title='Attempts' dataIndex='2019__pass_attemps' />
          <Column width='100px' title='Average' dataIndex='2019__pass_yards_per_attempt' />
        </ColumnGroup>
        <ColumnGroup title='2018'>
          <Column width='100px' title='Yards' dataIndex='2018__pass_yards' />
          <Column width='100px' title='Attempts' dataIndex='2018__pass_attemps' />
          <Column width='100px' title='Average' dataIndex='2018__pass_yards_per_attempt' />
        </ColumnGroup>
      </ColumnGroup>
      <ColumnGroup title='Rushing'>
        <ColumnGroup title='2020'>
          <Column width='100px' title='Yards' dataIndex='2020__rush_yards' />
          <Column width='100px' title='Attempts' dataIndex='2020__rush_attemps' />
          <Column width='100px' title='Average' dataIndex='2020__rush_yards_per_attempt' />
        </ColumnGroup>
        <ColumnGroup title='2019'>
          <Column width='100px' title='Yards' dataIndex='2019__rush_yards' />
          <Column width='100px' title='Attempts' dataIndex='2019__rush_attemps' />
          <Column width='100px' title='Average' dataIndex='2019__rush_yards_per_attempt' />
        </ColumnGroup>
        <ColumnGroup title='2018'>
          <Column width='100px' title='Yards' dataIndex='2018__rush_yards' />
          <Column width='100px' title='Attempts' dataIndex='2018__rush_attemps' />
          <Column width='100px' title='Average' dataIndex='2018__rush_yards_per_attempt' />
        </ColumnGroup>
      </ColumnGroup>
    </AntTable>
  )

}

export default TablePivot