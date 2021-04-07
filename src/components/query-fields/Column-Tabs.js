import React, {  } from "react";
import {Tabs, Button,  } from 'antd';
import ColumnForm from './Column-Form'
const { TabPane } = Tabs;


  
class ColumnTabs extends React.Component {

    tabButtons = {
        right: <Button type="default" onClick={() => this.onDuplicate()}>Duplicate Tab</Button>,
    };

    onDuplicate = () => {
        const { panes, activeKey, newTabIndex } = this.props.state;
        const fieldsToDuplicate = this.props.queryForm.getFieldsValue().columns[`col${activeKey}`]

        const newPanes = [...panes];
        newPanes.push({ title: `Col ${newTabIndex}`, key: `${newTabIndex}` });
        this.props.setState({
            panes: newPanes,
            activeKey: `${newTabIndex}`,
            newTabIndex: newTabIndex + 1 
        });

        this.props.queryForm.setFieldsValue({columns: {[`col${newTabIndex}`]: fieldsToDuplicate }}) 
    }
  
    onChange = activeKey => {
        this.props.setState(prev => ({...prev, activeKey}));
    };
  
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };
  
    add = () => {
        const { panes, newTabIndex } = this.props.state;
        const newPanes = [...panes];
        newPanes.push({ title: `Col ${newTabIndex}`, key: `${newTabIndex}` });
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
                tabBarExtraContent={this.tabButtons}
                size='default'
                tabBarStyle={{ }}
                animated={{ inkBar: false, tabPane: false }}
            >
            
            {panes.map(pane => (
                <TabPane forceRender={true} tab={pane.title} key={pane.key}>
                    <ColumnForm key={`col${pane.key}`} queryForm={this.props.queryForm} colIndex={`col${pane.key}`}/>
                </TabPane>
            ))}
            
            </Tabs>
        
        );
    }
}


export default ColumnTabs;
