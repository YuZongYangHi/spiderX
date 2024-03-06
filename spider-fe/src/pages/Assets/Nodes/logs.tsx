import ReactJson from 'react-json-view'
import {ProTable, ProDescriptions} from "@ant-design/pro-components";
import {useIntl, useParams} from "umi";
import {useState} from "react";
import {auditOperateMethodFilter} from "@/util/dataConvert";
import {queryAuditOperateLog} from "@/services/Audit/api";
import {SortOrder} from "antd/lib/table/interface";
import fetchUtil from "@/util/ProTableRequest";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import {Drawer, Tag} from 'antd';
import {clickExtender} from "@/components/Style/style";

const tagColor = {
  1: "success",
  2: "warning",
  3: "error"
}

export default (props: any) => {
  const intl = useIntl()
  const params = useParams()
  const [data, setData] = useState([])
  const [currentRow, setCurrentRow] = useState({})
  const [open, setOpen] = useState(false)
  const handleDetailOpen = () => {
    setOpen(true)
  }

  const handleDetailClose = () => {
    setCurrentRow({})
    setOpen(false)
  }
  const fetchParams: fetchParamsType = {
    requestQueryFieldOptions: ["username", "type", "resourceName"],
    requestQuery: {"resourceName": props && props.resourceName ? props.resourceName : "node"},
    requestParams: [props && props.resourceId ? props.resourceId : params.nodeId],
    fetch: queryAuditOperateLog
  }
  console.log(props && props.resourceId ? props.resourceId :params.nodeId, "<-----")
  const columns = [
    {
      title: intl.formatMessage({id: "assets.node.table.column.id"}),
      dataIndex: "id",
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.audit.operate.table.column.type'}),
      dataIndex: "type",
      valueType: "select",
      valueEnum: auditOperateMethodFilter,
      render: (_, record) => {
        return <Tag color={tagColor[record.type]}>{auditOperateMethodFilter[record.type].text}</Tag>
      }
    },
    {
      title: intl.formatMessage({id: 'assets.audit.operate.table.column.username'}),
      dataIndex: "username"
    }, {
      title: intl.formatMessage({id: 'assets.audit.operate.table.column.datetime'}),
      dataIndex: "datetime",
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.option'}),
      key: 'option',
      valueType: 'option',
      render: (_, record) => [
        <span key={"detail"} style={clickExtender} onClick={()=>{
          setCurrentRow(record)
          handleDetailOpen()
        }}>{intl.formatMessage({id: 'assets.node.table.option.detail'})}</span>
      ]
    }
  ]

  const fetch = async (params: object, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
    const result = await fetchUtil(fetchParams, params, sort, filter)
    if (result.success) {
      setData(result.data)
    }
    return result
  }
  return (
    <>
   <ProTable
     rowKey="id"
     columns={columns}
     request={fetch}
     size="small"
     options={false}
     pagination={{
       showSizeChanger: true
     }}
   />
      <Drawer
        title={intl.formatMessage({id: 'assets.audit.operate.detail.title'})}
        placement="right"
        width={700}
        onClose={handleDetailClose}
        open={open}
      >
        <ProDescriptions column={2} title={false}>
          <ProDescriptions.Item
            label={intl.formatMessage({id: "assets.node.table.column.id"})}
          >
            {currentRow.id}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={intl.formatMessage({id: 'assets.audit.operate.table.column.type'})}
          >
            {open && <Tag color={tagColor[currentRow.type]}>{auditOperateMethodFilter[currentRow.type].text}</Tag>}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={intl.formatMessage({id:'assets.audit.operate.table.column.username'})}
          >
            {currentRow.username}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={intl.formatMessage({id: 'assets.audit.operate.table.column.datetime'})}
          >
            {currentRow.datetime}
          </ProDescriptions.Item>
        </ProDescriptions>

        <ProDescriptions column={1}>
          <ProDescriptions.Item
            label={intl.formatMessage({id: "assets.audit.operate.detail.src"})}
          >
            {open ? <ReactJson src={JSON.parse(currentRow.srcData)}/> :<></>}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={intl.formatMessage({id: "assets.audit.operate.detail.target"})}
          >
            {open ? <ReactJson src={JSON.parse(currentRow.targetData)}/> :<></>}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label={intl.formatMessage({id: "assets.audit.operate.detail.diff"})}
          >
            {open ? <ReactJson src={JSON.parse(currentRow.diffData)}/> :<></>}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Drawer>
    </>
  )
}
