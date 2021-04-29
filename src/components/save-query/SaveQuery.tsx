import React, { useState, useEffect } from "react";
import { Button, Divider, Form, Spin, Typography, FormInstance, Drawer, DrawerProps, Input } from "antd";
import { DownloadOutlined, CloudUploadOutlined, CopyOutlined } from "@ant-design/icons";
import { SaveData, TableData } from "../types/MainTypes";
import { messageDisplay } from "../helper-functions";

const { Title, Paragraph, Text } = Typography;

interface SaveQueryProps {
    isVisible: boolean;
    setIsVisible: (arg0: boolean) => void;
    saveQuery: (queryTitle: string) => Promise<{ success: boolean; saveID?: string; error?: string }>;
}

export default function SaveQuery(props: SaveQueryProps) {
    const { isVisible, setIsVisible, saveQuery } = props;

    const [urlText, setURLText] = useState("");
    const [loadingURL, setLoadingURL] = useState(false);
    const [saveQueryForm] = Form.useForm<FormInstance>();

    const generateURL = async () => {
        setLoadingURL(true);
        const queryTitle = saveQueryForm.getFieldValue(["title"]);
        const save = await saveQuery(queryTitle);
        if (save.success) {
            setURLText(`${window.origin}/saves/${save.saveID}`);
        } else {
            console.log(save.error);
            messageDisplay("error", `There was an error. Please refresh the page to try again.`);
        }
        setLoadingURL(false);
    };

    const closeDrawer = () => {
        setIsVisible(false);
        setURLText("");
    };

    const footer = (
        <div style={{ textAlign: "right" }}>
            <Button onClick={() => closeDrawer()} style={{ marginRight: 8 }}>
                {" "}
                Close{" "}
            </Button>
        </div>
    );

    const urlDrawerProps: DrawerProps = {
        title: "Save & Share URL",
        width: "min(100%, 550px)",
        visible: isVisible,
        placement: "left",
        onClose: () => closeDrawer(),
        bodyStyle: { paddingBottom: 24, paddingLeft: 12, paddingRight: 12 },
        footer: footer,
    };

    return (
        <Drawer {...urlDrawerProps}>
            <Spin spinning={loadingURL}>
                <Form colon form={saveQueryForm}>
                    <Form.Item name="title" label="Enter a title for this query">
                        <Input placeholder="(optional)" />
                    </Form.Item>
                </Form>

                <Divider />

                {!urlText && (
                    <Button block onClick={() => generateURL()} type="primary">
                        Generate URL
                    </Button>
                )}

                {urlText && (
                    <Paragraph>
                        <Text strong>Shareable URL:</Text>
                        <pre>
                            <Text
                                style={{ fontSize: "0.75rem" }}
                                copyable={{ icon: <CopyOutlined style={{ paddingLeft: 4, fontSize: "1.1rem" }} key="copy-icon" /> }}
                            >
                                {urlText}
                            </Text>
                        </pre>
                    </Paragraph>
                )}
            </Spin>
        </Drawer>
    );
}
