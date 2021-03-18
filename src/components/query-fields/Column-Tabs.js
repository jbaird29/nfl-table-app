import React, {  } from "react";
import {Tabs} from 'antd';
import ColumnForm from './Column-Form'
const { TabPane } = Tabs;


const initialPanes = [
    { title: 'Column 1', key: '1' },
];
  
class ColumnTabs extends React.Component {
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
        newPanes.push({ title: `Column ${this.tabIndex}`, key: activeKey });
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

        const colIndex = `col${targetKey}`
        // this.props.setQueryFields(prior => (
        //     Object.assign(...Object.keys(prior)
        //     .filter(key => key !== colName)
        //     .map(key => ({[key]: prior[key]}))
        //     )
        // ))
        this.props.setQueryFields(prior => ({
            ...prior,
            columns: prior.columns.filter(column => column.colIndex !== colIndex)
        }))
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
              <ColumnForm setQueryFields={this.props.setQueryFields} index={pane.key} />
            </TabPane>
        ))}
        </Tabs>
        );
    }
}


export default ColumnTabs;