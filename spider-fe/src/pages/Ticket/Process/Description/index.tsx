import {ProCard, ProDescriptions} from '@ant-design/pro-components'
import {Space, Tag} from "antd";

export default (props: ProcessParams.Description) => {
  const formatFormValue = (item: TicketResponse.RecordForm) => {
    const multiType = [8, 10, 12, 13, 14]
    if (item.fieldType === 3) {
      return `${item.fieldValue.split(',')[0]} ~ ${item.fieldValue.split(",")[1]}`
    }
    if (multiType.indexOf(item.fieldType) !== -1) {
      const sp = item.fieldValue.split(",")
      return <Space>{sp.map((item, index)=> (<Tag key={index}>{item}</Tag>))}</Space>
    }
    return item.fieldValue
  }

  return (
    <ProCard
      title={props.record.category.name}
      headerBordered
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        marginBottom: 12
      }}>
      <ProDescriptions
        column={3}
        title={false}
      >
        {
          props.formList.map((item, index) => (
            props.getCurrentNodeFieldState(item.fieldKey, item.fieldType.toString()) === 1 && <ProDescriptions.Item key={index} label={item.fieldLabel}>
              {formatFormValue(item)}
            </ProDescriptions.Item>
          ))
        }
      </ProDescriptions>
    </ProCard>
  )
}
