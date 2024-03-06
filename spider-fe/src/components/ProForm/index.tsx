import {ProForm as FormForms} from '@ant-design/pro-components'

export const ProFormItemRender = (column: ProForm.columns, index: number) => {
  if (column.type === "custom") {
    return <FormForms.Item
            key={index}
            name={column.name}
            label={column.label}
            rules={[{
              required: column.rules.required,
              message: column.rules.message
            }]}
          ><column.component{...column.options} /></FormForms.Item>
  } else if (column.type === "antd") {
    return <FormForms.Item
      key={index}
      name={column.name}
      label={column.label}
      rules={[{
        required: column.rules.required,
        message: column.rules.message
      }]}
    ><column.component {...column.options}>{column.element}</column.component>
    </FormForms.Item>
  }
  return <column.component
          key={index}
          name={column.name}
          label={column.label}
          width={column.width || 'xl'}
          placeholder={column.placeholder}
          rules={[{
            required: column.rules.required,
            message: column.rules.message
          }]}
        {...column.options}
  />
}
