declare namespace ProForm {
  type params = {
    title: string;
    width: string | "500px";
    columns: columns[]
  }
  type columns = {
    name: string;
    label: string;
    width: string | "xl";
    rules: rules;
    placeholder: string;
    component: React.FC;
    element?: React.FC;
    options: any;
    type?: "proFormItem" | "custom" | "antd"
  }

  type rules = {
    required: boolean;
    message: string;
  }
}
