import React, {  } from "react";
import {Tabs, } from 'antd';
import CustomCalcForm from './Custom-Calc-Form'
const { TabPane } = Tabs;


  
export default class CustomCalcTabs extends React.Component {

    tabIndex = Math.max(...this.props.initialCalcsPanes.map(pane => pane.key));
  
    state = {
        activeKey: this.props.initialCalcsPanes[0].key,
        panes: this.props.initialCalcsPanes,
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
        newPanes.push({ title: `Calc ${this.tabIndex}`, key: activeKey });
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
            <TabPane forceRender={true} tab={pane.title} key={pane.key}>
              <CustomCalcForm calcsForm={this.props.calcsForm} tableData={this.props.tableData} calcIndex={`calc${pane.key}`} />
            </TabPane>
        ))}
        </Tabs>
        );
    }
}