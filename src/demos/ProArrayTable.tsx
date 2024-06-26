import {
  ArrayBase,
  Editable,
  FormButtonGroup,
  FormItem,
  Input,
  Submit,
} from "@formily/antd";
import {
  createForm,
  onFieldValueChange,
  onFormValuesChange,
} from "@formily/core";
import { FormProvider, ISchema, createSchemaField } from "@formily/react";
import { Button, ConfigProvider, Divider, Space } from "antd";
import "antd/dist/antd.css";

import zhCN from "antd/lib/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

import { ProArrayTable } from "@pro.formily/antd";
import { useEffect } from "react";

const CustomeToolbar = () => {
  const row = ProArrayTable.useTableRowSelection();
  return (
    <Space>
      <Button
        type="primary"
        onClick={() => {
          if (!row) return;
          console.log(row.selectedRowKeys);
        }}
      >
        自定义 toolbar , 点我试试
      </Button>
    </Space>
  );
};
const CustomeFooter = () => {
  const array = ArrayBase.useArray!();
  const page = ProArrayTable.useTablePagination();
  const totalPage = page
    ? ((page.total || 0)! / (page.pageSize || 1)).toFixed(0)
    : 0;
  return (
    <Space>
      自定义底部
      {!page ? 0 : page?.current}/{totalPage}, 共计
      {array?.field?.value?.length}条数据
    </Space>
  );
};

const RowSummary = () => {
  const row = ArrayBase.useRecord!();
  console.log("🚀 ~ RowSummary ~ row:", row);
  const summary = row ? "" : row.a1 + row.a2 + row.a3;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "16px",
      }}
    >
      我是自定义 row render {summary} 👇🏻 是 schame 形式的 row render
    </div>
  );
};

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Editable,
    Input,
    ProArrayTable,
    // 组件名称必须包含 Toolbar
    CustomeToolbar,
    // 组件名称必须包含 Footer
    CustomeFooter,
    RowSummary,
  },
});

const form = createForm({
  effects() {
    onFormValuesChange(() => {
      console.log("form values change ");
    });
    onFieldValueChange("*", (field) => {
      console.log("change ", field.path.entire, (field as any).value);
    });
  },
});

const row: ISchema = {
  items: {
    type: "object",
    properties: {
      _sort: {
        type: "void",
        "x-component": "ProArrayTable.Column",
        "x-component-props": { width: 60, title: "Sort", align: "center" },
        properties: {
          sort: {
            type: "void",
            "x-component": "ProArrayTable.SortHandle",
          },
        },
      },
      _index: {
        type: "void",
        "x-component": "ProArrayTable.Column",
        "x-component-props": { width: 60, title: "Index", align: "center" },
        properties: {
          index: {
            type: "void",
            "x-component": "ProArrayTable.Index",
          },
        },
      },
      _a1: {
        type: "void",
        "x-component": "ProArrayTable.Column",
        "x-component-props": { width: 160, title: "A1" },
        properties: {
          a1: {
            type: "string",
            "x-decorator": "Editable",
            "x-component": "Input",
          },
        },
      },
      _a2: {
        type: "void",
        "x-component": "ProArrayTable.Column",
        "x-component-props": { width: 160, title: "A2" },
        properties: {
          a2: {
            type: "string",
            "x-decorator": "FormItem",
            "x-component": "Input",
          },
        },
      },
      _a3: {
        type: "void",
        "x-component": "ProArrayTable.Column",
        "x-component-props": { width: 160, title: "A3" },
        properties: {
          a3: {
            type: "string",
            "x-decorator": "FormItem",
            "x-component": "Input",
          },
        },
      },
      _action: {
        type: "void",
        "x-component": "ProArrayTable.Column",
        "x-component-props": {
          title: "Action",
          width: 140,
          dataIndex: "actinos",
          fixed: "right",
        },
        properties: {
          item: {
            type: "void",
            "x-component": "FormItem",
            properties: {
              remove: {
                type: "void",
                "x-component": "ProArrayTable.Remove",
                "x-component-props": {
                  confirm: true,
                },
              },
              moveDown: {
                type: "void",
                "x-component": "ProArrayTable.MoveDown",
              },
              moveUp: {
                type: "void",
                "x-component": "ProArrayTable.MoveUp",
              },
            },
          },
        },
      },
    },
  },
};

const subRow: ISchema = JSON.parse(JSON.stringify(row));
// biome-ignore lint/performance/noDelete: <explanation>
delete (subRow as any).items.properties._sort;
// biome-ignore lint/performance/noDelete: <explanation>
delete (subRow as any).items.properties._action;

(row.items as any).properties = {
  ...(row.items as any).properties,
  _expand: {
    type: "void",
    "x-component": "ProArrayTable.RowExpand",
    properties: {
      summary: {
        type: "void",
        "x-component": "RowSummary",
      },
      subitems: {
        type: "array",
        "x-component": "ProArrayTable",
        "x-read-pretty": true,
        "x-component-props": {
          showHeader: false,
          settings: false,
          bordered: false,
        },
        items: subRow.items,
      },
    },
  },
};

const schema: ISchema = {
  type: "object",
  properties: {
    array: {
      type: "array",
      title: "Array Table Pro Max",
      "x-component": "ProArrayTable",
      "x-component-props": {
        scroll: { x: "100%" },
        resizeable: true,
        rowSelection: true,
        expandable: {
          rowExpandable: (record: any) => Array.isArray(record.subitems),
        },
        onRemove() {
          console.log({
            key: "rmLoading",
            content: "删除中...",
          });
          return new Promise((resolve) => {
            setTimeout(resolve, 1000);
          }).then(() => {
            console.log("DONE!");
          });
        },
      },
      items: row.items,
      properties: {
        toolbar: {
          type: "void",
          "x-component": "CustomeToolbar",
        },
        add: {
          type: "void",
          "x-component": "ProArrayTable.Addition",
          title: "添加条目",
        },
        footer: {
          type: "void",
          "x-component": "CustomeFooter",
        },
      },
    },
  },
};
const range = (count: number) =>
  Array.from(new Array(count)).map((_, key) => {
    const ret = {
      a1: `${key}.1`,
      a2: `${key}.2`,
      a3: `${key}.3`,
      subitems: [] as any[],
    };
    ret.subitems =
      Math.random() > 0.45
        ? [
            {
              a1: `c.${ret.a1}`,
              a2: `c.${ret.a2}`,
              a3: `c.${ret.a3}`,
            },
          ]
        : (undefined as any);
    return ret;
  });

export default () => {
  console.log("form", form);
  // const [row, $row] = useFormArrayProps(form, "array", "rowSelection");
  useEffect(() => {
    console.log("row is change ", row);
  }, [row]);

  return (
    <ConfigProvider locale={zhCN}>
      <FormProvider form={form}>
        <SchemaField schema={schema} />
        <Divider orientation="right">
          <FormButtonGroup>
            <Submit onSubmit={console.log}>提交</Submit>
          </FormButtonGroup>
        </Divider>
        <Space>
          {/* <Button
            onClick={() => {
              // simple way
              const hasIndex =
                $row?.selectedRowKeys?.findIndex((x) => x === 2) ?? -1;

              console.log("🚀 ~ hasIndex:", hasIndex);
              if (hasIndex >= 0) {
                $row?.selectedRowKeys?.splice(hasIndex, 1);
              } else {
                $row?.selectedRowKeys?.push(2);
              }
              //  work but verbose
              // form
              // 	.query("array")
              // 	.take()
              // 	?.setState((s) => {
              // 		s.componentProps?.rowSelection?.selectedRowKeys?.push?.(2);
              // 	});
            }}
          >
            切换第三项选中框
          </Button> */}
          <Button
            onClick={() => {
              form.setValues({
                array: range(10 * 10000),
                // array: range(10 * 10),
              });
            }}
          >
            加载 10万条超大数据
          </Button>
        </Space>
      </FormProvider>
    </ConfigProvider>
  );
};
