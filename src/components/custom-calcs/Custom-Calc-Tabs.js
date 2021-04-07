import React, {  } from "react";
import {Tabs, } from 'antd';
import CustomCalcForm from './Custom-Calc-Form'
const { TabPane } = Tabs;


  
export default class CustomCalcTabs extends React.Component {
  
    onChange = activeKey => {
        this.props.setState(prev => ({...prev, activeKey}));
    };
  
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };
  
    add = () => {
        const { panes, newTabIndex } = this.props.state;
        const newPanes = [...panes];
        newPanes.push({ title: `Calc ${newTabIndex}`, key: `${newTabIndex}` });
        this.props.setState({
            panes: newPanes,
            activeKey: `${newTabIndex}`,
            newTabIndex: newTabIndex + 1 
        });
    };

  
    remove = targetKey => {
        const { panes, activeKey } = this.props.state;
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

        this.props.setState(prev => ({
            ...prev,
            panes: newPanes,
            activeKey: newActiveKey,
        }));

    };
  
    render() {
        const { panes, activeKey } = this.props.state;
        return (
        <Tabs
            type="editable-card"
            onChange={this.onChange}
            activeKey={activeKey}
            onEdit={this.onEdit}
        >
        {panes.map(pane => (
            <TabPane forceRender={true} tab={pane.title} key={pane.key}>
              <CustomCalcForm key={`calc${pane.key}`}  calcsForm={this.props.calcsForm} tableData={this.props.tableData} calcIndex={`calc${pane.key}`} />
            </TabPane>
        ))}
        </Tabs>
        );
    }
}