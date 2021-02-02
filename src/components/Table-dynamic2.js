import React, { useState } from "react";
import { Table as AntTable } from 'antd';
import 'antd/dist/antd.css';
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";


function TableDynamic2(props) {
  const dataSource = [
    {
      "player_name": "Deshaun Watson",
      "2020__pass__yards": "4823.0",
      "2020__pass__attemps": "544.0",
      "2020__pass__yards_per_attempt": "8.9",
      "2020__rush__yards": "444.0",
      "2020__rush__attemps": "90.0",
      "2020__rush__yards_per_attempt": "4.9",
      "2019__pass__yards": "3852.0",
      "2019__pass__attemps": "495.0",
      "2019__pass__yards_per_attempt": "7.8",
      "2019__rush__yards": "413.0",
      "2019__rush__attemps": "82.0",
      "2019__rush__yards_per_attempt": "5.0",
      "2018__pass__yards": "4165.0",
      "2018__pass__attemps": "505.0",
      "2018__pass__yards_per_attempt": "8.2",
      "2018__rush__yards": "551.0",
      "2018__rush__attemps": "99.0",
      "2018__rush__yards_per_attempt": "5.6"
    },
    {
      "player_name": "Patrick Mahomes II",
      "2020__pass__yards": "4740.0",
      "2020__pass__attemps": "588.0",
      "2020__pass__yards_per_attempt": "8.1",
      "2020__rush__yards": "308.0",
      "2020__rush__attemps": "62.0",
      "2020__rush__yards_per_attempt": "5.0",
      "2019__pass__yards": "4031.0",
      "2019__pass__attemps": "484.0",
      "2019__pass__yards_per_attempt": "8.3",
      "2019__rush__yards": "218.0",
      "2019__rush__attemps": "43.0",
      "2019__rush__yards_per_attempt": "5.1",
      "2018__pass__yards": "5097.0",
      "2018__pass__attemps": "580.0",
      "2018__pass__yards_per_attempt": "8.8",
      "2018__rush__yards": "272.0",
      "2018__rush__attemps": "60.0",
      "2018__rush__yards_per_attempt": "4.5"

    },
    {
      "player_name": "Tom Brady",
      "2020__pass__yards": "4633.0",
      "2020__pass__attemps": "610.0",
      "2020__pass__yards_per_attempt": "7.6",
      "2020__rush__yards": "6.0",
      "2020__rush__attemps": "30.0",
      "2020__rush__yards_per_attempt": "0.2",
      "2019__pass__yards": "4057.0",
      "2019__pass__attemps": "613.0",
      "2019__pass__yards_per_attempt": "6.6",
      "2019__rush__yards": "34.0",
      "2019__rush__attemps": "26.0",
      "2019__rush__yards_per_attempt": "1.3",
      "2018__pass__yards": "4355.0",
      "2018__pass__attemps": "570.0",
      "2018__pass__yards_per_attempt": "7.6",
      "2018__rush__yards": "35.0",
      "2018__rush__attemps": "23.0",
      "2018__rush__yards_per_attempt": "1.5"
    },
  ]

  const groupings = {
    "player_name": [],
    "2020__pass__yards": ["2020", "pass"],
    "2020__pass__attemps": ["2020", "pass"],
    "2020__pass__yards_per_attempt": ["2020", "pass"],
    "2020__rush__yards": ["2020", "rush"],
    "2020__rush__attemps": ["2020", "rush"],
    "2020__rush__yards_per_attempt": ["2020", "rush"],
    "2019__pass__yards": ["2019", "pass"],
    "2019__pass__attemps": ["2019", "pass"],
    "2019__pass__yards_per_attempt": ["2019", "pass"],
    "2019__rush__yards": ["2019", "rush"],
    "2019__rush__attemps": ["2019", "rush"],
    "2019__rush__yards_per_attempt": ["2019", "rush"],
    "2018__pass__yards": ["2018", "pass"],
    "2018__pass__attemps": ["2018", "pass"],
    "2018__pass__yards_per_attempt": ["2018", "pass"],
    "2018__rush__yards": ["2018", "rush"],
    "2018__rush__attemps": ["2018", "rush"],
    "2018__rush__yards_per_attempt": ["2018", "rush"]
  }
  const group1 = ['2020', '2019', '2018']
  const group2 = ['pass', 'rush']

  const columns = Object.keys(dataSource[0])
  
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
      scroll={{ y: 500 }}
      size={"small"}
      showSorterTooltip={true}
      sortDirections={["ascend", "descend"]}
      rowKey='player_name'
    >
        <Column width='100px' title='player_name' dataIndex='player_name'  />
        {group1.map(group1Title => (
            <ColumnGroup title={group1Title}>
                {group2.map(group2Title => (
                    <ColumnGroup title={group2Title}>
                        {columns.filter(columnTitle => groupings[columnTitle].includes(group1Title) && groupings[columnTitle].includes(group2Title))
                        .map(columnTitle => <Column width='100px' title={columnTitle.slice(group1Title.length+2 + group2Title.length+2)} dataIndex={columnTitle} />)}
                    </ColumnGroup>
                ))}
            </ColumnGroup>
        ))}
    </AntTable>
  )

}

export default TableDynamic2