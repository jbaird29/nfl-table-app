import React, { useState } from "react";
import {Button, Tabs} from 'antd';
import CustomCalcForm from './Custom-Calc-Form'
const { TabPane } = Tabs;

/*
    TBU - goal will be to change the 'Custom Calculations' UI to incorporate tabbing, similar
    to the Edit Fields UI
*/

const initialPanes = [
    { title: 'Calculation 1', key: '1' },
];
  
export default class CustomCalcTabs extends React.Component {
    tabIndex = 1;
  
    state = {
        activeKey: initialPanes[0].key,
        panes: initialPanes,
    };
  
    onChange = activeKey => {
        this.setState({ activeKey });
    };
  
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };
  
    add = () => {
        this.tabIndex++
        const { panes } = this.state;
        const activeKey = `${this.tabIndex}`;
        const newPanes = [...panes];
        newPanes.push({ title: `Calculation ${this.tabIndex}`, key: activeKey });
        this.setState({
            panes: newPanes,
            activeKey,
        });
    };
  
    remove = targetKey => {
        const { panes, activeKey } = this.state;
        let newActiveKey = activeKey;
        let lastIndex;
        panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
            lastIndex = i - 1;
            }
        });

        const newPanes = panes.filter(pane => pane.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }

        this.setState({
            panes: newPanes,
            activeKey: newActiveKey,
        });

        // removes the calculation from the global state
        const calcIndex = `calc${targetKey}`
        this.props.setCustomCalcs(prior => prior.filter(form => form.calcIndex !== calcIndex))
    };
  
    render() {
        const { panes, activeKey } = this.state;
        return (
        <Tabs
            type="editable-card"
            onChange={this.onChange}
            activeKey={activeKey}
            onEdit={this.onEdit}
        >
        {panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key}>
              <CustomCalcForm setCustomCalcs={this.props.setCustomCalcs} tableData={this.props.tableData} index={pane.key} />
            </TabPane>
        ))}
        </Tabs>
        );
    }
}