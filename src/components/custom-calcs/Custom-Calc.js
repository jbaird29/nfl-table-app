import React, {} from "react";
import {Modal, } from 'antd';
import CustomCalcTabs from './Custom-Calc-Tabs'

export default function CustomCalc(props) {

    const modalProps = {
        title: "Edit Custom Calculations",
        visible: props.isVisible,
        onOk: props.submitCustomCalcs,
        onCancel: () => props.setVisible(false),
        width: 750,
        style: {top: 150}
    }

    return (<>
        <>
        <Modal {...modalProps}>
            {props.tableData.columns && props.tableData.columns.length > 0 ?
            <CustomCalcTabs setCustomCalcs={props.setCustomCalcs} tableData={props.tableData} />
            : <p>Please select fields first</p>}
        </Modal>
        </>
    </>);
};
