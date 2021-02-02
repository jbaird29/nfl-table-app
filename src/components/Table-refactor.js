import React, { useState } from "react";
import { Table as AntTable } from 'antd';
import 'antd/dist/antd.css';
import Column from "antd/lib/table/Column";
import ColumnGroup from "antd/lib/table/ColumnGroup";


function TableRefactor(props) {
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

  const columns = [
    {
      title: 'Player',
      dataIndex: 'player_name',
      width: '100px',
      sorter: (a, b) => a.player_name - b.player_name
    },
    {
      title: '2020',
      children: [
        {
          title: 'pass',
          children: [
            {
              title: 'yards',
              dataIndex: '2020__pass__yards',
              width: '100px'
            },
            {
              title: 'attempts',
              dataIndex: '2020__pass__attemps',
              width: '100px'
            },
            {
              title: 'Yards per Attemps',
              dataIndex: '2020__pass__yards_per_attempt',
              width: '100px'
            }
          ]
        },
        {
          title: 'rush',
          children: [
            {
              title: 'yards',
              dataIndex: '2020__rush__yards',
              width: '100px'
            },
            {
              title: 'attempts',
              dataIndex: '2020__rush__attemps',
              width: '100px'
            },
            {
              title: 'Yards per Attemps',
              dataIndex: '2020__rush__yards_per_attempt',
              width: '100px'
            }
          ]
        }
      ]
    },
    {
      title: '2019',
      children: [
        {
          title: 'pass',
          children: [
            {
              title: 'yards',
              dataIndex: '2019__pass__yards',
              width: '100px'
            },
            {
              title: 'attempts',
              dataIndex: '2019__pass__attemps',
              width: '100px'
            },
            {
              title: 'Yards per Attemps',
              dataIndex: '2019__pass__yards_per_attempt',
              width: '100px'
            }
          ]
        },
        {
          title: 'rush',
          children: [
            {
              title: 'yards',
              dataIndex: '2019__rush__yards',
              width: '100px'
            },
            {
              title: 'attempts',
              dataIndex: '2019__rush__attemps',
              width: '100px'
            },
            {
              title: 'Yards per Attemps',
              dataIndex: '2019__rush__yards_per_attempt',
              width: '100px'
            }
          ]
        }
      ]
    },
    {
      title: '2018',
      children: [
        {
          title: 'pass',
          children: [
            {
              title: 'yards',
              dataIndex: '2018__pass__yards',
              width: '100px'
            },
            {
              title: 'attempts',
              dataIndex: '2018__pass__attemps',
              width: '100px'
            },
            {
              title: 'Yards per Attemps',
              dataIndex: '2018__pass__yards_per_attempt',
              width: '100px'
            }
          ]
        },
        {
          title: 'rush',
          children: [
            {
              title: 'yards',
              dataIndex: '2018__rush__yards',
              width: '100px'
            },
            {
              title: 'attempts',
              dataIndex: '2018__rush__attemps',
              width: '100px'
            },
            {
              title: 'Yards per Attemps',
              dataIndex: '2018__rush__yards_per_attempt',
              width: '100px'
            }
          ]
        }
      ]
    }
  ]

  
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
      sortDirections={["ascend", "descend"]}
      rowKey='player_name'
    />
  )

}

export default TableRefactor