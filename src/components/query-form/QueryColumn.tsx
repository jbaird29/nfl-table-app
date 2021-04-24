import React from "react";
import { Form, Input, Button, Space, Select, Row, Divider, Slider, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import statsInputs from "../../inputs/statsInputs.json";
import { NamePath } from "rc-field-form/lib/interface";

export default function QueryColumn() {
  const [columnForm] = Form.useForm();

  interface FilterInput {
    formProps: object;
    ui: {
      type: "select" | "inputNumber" | "slider";
      props: object;
    };
  }

  function renderFilterObject(filter: FilterInput, name: NamePath, key: string) {
    return (
      <Form.Item {...filter.formProps} name={name} key={key}>
        {filter.ui.type === "select" ? (
          <Select {...filter.ui.props} />
        ) : filter.ui.type === "slider" ? (
          <Slider {...filter.ui.props} />
        ) : filter.ui.type === "inputNumber" ? (
          <InputNumber {...filter.ui.props} />
        ) : null}
      </Form.Item>
    );
  }

  const onFinish = (values: object) => {
    console.log(values);
  };

  const statInputSelectProps = {
    style: { width: 200 },
    placeholder: "Stat Type",
    align: "center",
    showSearch: true,
    optionFilterProp: "label",
    options: statsInputs,
  };

  const filterTypeSelectProps = {
    style: { width: 200 },
    placeholder: "Select Filter Type",
    align: "center",
    showSearch: true,
    optionFilterProp: "label",
    options: [
      {
        value: "season_year",
        label: "Year",
      },
      {
        value: "player_name_with_position",
        label: "Player",
      },
      {
        value: "team_name",
        label: "Team",
      },
    ],
  };

  const seasonYearSelectProps = {
    style: { width: 200 },
    align: "center",
    options: [
      {
        value: "2020",
      },
      {
        value: "2019",
      },
      {
        value: "2018",
      },
    ],
  };

  const testSetFields = {
    columns: [
      {
        field: "pass_completions_sum",
        title: "COMP",
        filters: [
          {
            field: "season_year",
            value: "2020",
          },
        ],
      },
      {
        field: "pass_incompletions_sum",
        title: "IN COMP",
      },
    ],
  };

  const testFields = () => {
    columnForm.setFieldsValue(testSetFields);
  };

  return (
    <Form form={columnForm} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.List name="columns">
        {(fields, { add, remove, move }) => (
          <>
            {fields.map(({ key, name: colNum, fieldKey, ...restField }) => (
              <div key={key}>
                <Space style={{ marginTop: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[colNum, "field"]}
                    fieldKey={[fieldKey, "field"]}
                    rules={[{ required: true, message: "Missing stat type" }]}
                    label={`Column ${colNum + 1}`}
                  >
                    <Select {...statInputSelectProps} />
                  </Form.Item>
                  <Form.Item {...restField} name={[colNum, "title"]} fieldKey={[fieldKey, "title"]}>
                    <Input placeholder="Enter a Column Title (Optional)" autoComplete="off" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(colNum)} />
                  <Button onClick={() => move(colNum, 0)}>Move to Top</Button>
                </Space>
                <Form.List name={[colNum, "filters"]}>
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item noStyle>
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                          Add filter
                        </Button>
                      </Form.Item>
                      {fields.map(({ key, name: filterNum, fieldKey, ...restField }) => (
                        <div key={key}>
                          <Space style={{ marginLeft: 84 }} align="baseline">
                            <Form.Item {...restField} name={[filterNum, "field"]} fieldKey={[fieldKey, "field"]}>
                              <Select {...filterTypeSelectProps} />
                            </Form.Item>
                            <Form.Item noStyle shouldUpdate={true}>
                              {({ getFieldValue }) =>
                                getFieldValue(["columns", colNum, "filters", filterNum, "field"]) !== "season_year" ? null : (
                                  <Form.Item label="Select Year" name={[filterNum, "value"]}>
                                    <Select {...seasonYearSelectProps} />
                                  </Form.Item>
                                )
                              }
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(filterNum)} />
                          </Space>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
                <Divider style={{ margin: "6px 0" }} />
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Column
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <Button onClick={testFields}>Test</Button>
    </Form>
  );
}
