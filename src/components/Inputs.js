import React from "react";
import {Collapse, Form, Input, Button, Radio, Slider, Modal} from 'antd';
import Stats from "./Stats";
import PassFilters from "./Filters-Pass";
import RushFilters from "./Filters-Rush";
import RecvFilters from "./Filters-Recv";
import GlobalFilters from "./Filters-Global";

const {Panel} = Collapse;

// add sort functions depending on data type
function addSorter(column) {
    if (column.dataType === 'number') {
        const columnName = column.dataIndex
        column.sorter = (a, b) => a[columnName] - b[columnName]
    } else if (column.dataType === 'string') {
        const columnName = column.dataIndex
        column.sorter = (a, b) => (a[columnName].toUpperCase() < b[columnName].toUpperCase() ? -1 : 1)
    }
}

// add render functions depending on format type
function addRender(column) {
    if (column.format === 'dec_0') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toLocaleString()}`}</span>)
    } else if (column.format === 'dec_1') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toFixed(1).toLocaleString()}`}</span>)
    } else if (column.format === 'dec_2') {
        column.render = (text, row, index) => (!text ? text : <span>{`${text.toFixed(2).toLocaleString()}`}</span>)
    } else if (column.format === 'index') {
        column.render = (text, row, index) => (!text ? text : <span>{`${index + 1}`}</span>)
    }
}

function buildRequestBody(values) {
    // row: can be inserted 'as-is'
    const row = values.row
    // years: fill out the array; original array is [2018, 2020] this makes it [2020, 2019, 2018]
    const years = []
    for (let i = values.years[1]; i >= values.years[0]; i--) {
        years.push(i)
    }
    // stats: if stat type's value is not 'undefined', add its value to the array
    const stats = []
    for (const statType in values.stats) {
        values.stats[statType] && stats.push(...values.stats[statType])
    }
    // where & having: if where and having are not undefined, add them, otherwise make it an empty object
    const whereObj = values.where || {}
    const havingObj = values.having || {}
    // turn where and having from object into an array of type: [{ field: 'inside_20', values: [1]}, ...]
    const where = Object.entries(whereObj).map(entry => {
        if (entry[1]) {  // if the value  is not undefined, add it, otherwise add undefined
            const key = entry[0]
            const values = Array.isArray(entry[1]) ? entry[1] : [entry[1]]  // makes values an array, even if single item
            return {field: key, values: values}
        }
    }).filter(entry => entry)
    const having = Object.entries(havingObj).map(entry => {
        if (entry[1]) {
            const key = entry[0]
            const value = entry[1] // for HAVING, value is single number (always >= for now)
            return {field: key, value: value}
        }
    }).filter(entry => entry)
    // return the request body
    return {row: row, years: years, stats: stats, where: where, having: having}
}

async function makeRequest(body) {
    const fetchOptions = { method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    }
    const response = await fetch(`http://localhost:9000/query`, fetchOptions)
    const tableData = await response.json();

    // for each column, add (1) sorter function (2) render function
    tableData.columns.forEach(column => {
        if ('children' in column) {
            column.children.forEach(child => {
                addSorter(child);
                addRender(child);
            })
        } else {
            addSorter(column);
            addRender(column);
        }
    })
    // add the new response to the tableData state
    return tableData
}

export default function Inputs(props) {
    async function onFinish(values) {
        // if there are no pass, rush, or recv stats selected, throw an error to user
        if (!values.stats.pass && !values.stats.rush && !values.stats.recv) {
            Modal.error({title: 'Please select at least one stat', content: 'Either passing, rushing, or receiving',});
            return
        }
        console.log('Success:', values);
        const body = buildRequestBody(values)
        console.log(body)
        const tableData = await makeRequest(body)
        props.setTableData(tableData)
    };

    function onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    };

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };

    const yearSliderProps = {
        range: true,
        max: 2020,
        min: 2016,
        marks: {2016: '2016', 2020: '2020'},
        included: true,
        style: {margin: '0 25px'}
    }

    const formProps = {
        ...layout,
        name: "basic",
        onFinish: onFinish,
        onFinishFailed: onFinishFailed,
        initialValues: {
            row: 'player_name',
            years: [2020, 2020]
        }
    }


    return (
        <Form {...formProps}>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>

            <Form.Item label="Select Row Type" name="row">
                <Radio.Group>
                    <Radio value="player_name">Player</Radio>
                    <Radio value="team_name">Team</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item label="Select Years: " name="years">
                <Slider {...yearSliderProps} />
            </Form.Item>

            <Stats/>

            <Collapse className="site-collapse-custom-collapse">
                <Panel header="Select Global Filters" key="1" className="site-collapse-custom-panel">
                    <GlobalFilters/>
                </Panel>

                <Panel header="Select Pass Filters" key="2" className="site-collapse-custom-panel">
                    <PassFilters/>
                </Panel>
                <Panel header="Select Rush Filters" key="3" className="site-collapse-custom-panel">
                    <RushFilters/>
                </Panel>
                <Panel header="Select Receiving Filters" key="4" className="site-collapse-custom-panel">
                    <RecvFilters/>
                </Panel>

            </Collapse>

        </Form>
    );
};
