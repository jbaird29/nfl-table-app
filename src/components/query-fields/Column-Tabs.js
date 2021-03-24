import React, {  } from "react";
import {Tabs, Button, Form } from 'antd';
import ColumnForm from './Column-Form'
const { TabPane } = Tabs;


  
class ColumnTabs extends React.Component {
    
    tabIndex = Math.max(...this.props.initialQueryPanes.map(pane => pane.key));
  
    state = {
        activeKey: this.props.initialQueryPanes[0].key,
        panes: this.props.initialQueryPanes,
    };

    tabButtons = {
        right: <Button type="default" onClick={() => this.onDuplicate()}>Duplicate Column</Button>,
    };

    onDuplicate = () => {
        const currentKey = this.state.activeKey
        const fieldsToDuplicate = this.props.queryForm.getFieldsValue().columns[`col${currentKey}`]
        const newKey = this.add()
        this.props.queryForm.setFieldsValue({columns: {[`col${newKey}`]: fieldsToDuplicate }}) 
    }
  
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
        newPanes.push({ title: `Column ${this.tabIndex}`, key: activeKey });
        this.setState({
            panes: newPanes,
            activeKey,
        });
        return this.tabIndex
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
                tabBarExtraContent={this.tabButtons}
                size='default'
                tabBarStyle={{ }}
                animated={{ inkBar: false, tabPane: false }}
            >
            
            {panes.map(pane => (
                <TabPane tab={pane.title} key={pane.key}>
                    <ColumnForm queryForm={this.props.queryForm} colIndex={`col${pane.key}`}/>
                </TabPane>
            ))}
            
            </Tabs>
        
        );
    }
}


export default ColumnTabs;
