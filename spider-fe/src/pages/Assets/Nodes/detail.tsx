import "./index.less"
import {queryNode} from '@/services/Assets/Node/api'
import {PageContainer, ProDescriptions, ProCard, ProColumns} from "@ant-design/pro-components";
import OperateLog from './logs'
import React, {useEffect, useState} from "react";
import ButterflyTitle from '@/components/ButterflyTitle'
import {useParams, useIntl, Access} from 'umi'
import {Flex, Tag, message} from 'antd';
import {
  nodeOperatorFilter,
  nodeStatusFilter,
  nodeContractFilter,
  nodeGradeFilter,
  nodeAttributeFilter,
  nodeAttributeConvert,
  regionFilter, nodeIsDeletedFilter, provinceHandleFilter
} from '@/util/dataConvert'
import {history} from "@@/core/history";
import moment from "moment";
import Loading from "@/components/Loading";
import {useAccess, useModel} from "@@/exports";
import {assetsNodePermissionsMenuKeys, checkUserHavePageReadPermissions} from "@/access";
import ForbiddenPage from "@/pages/403";

const provinceFilter = provinceHandleFilter()

export default () => {
  const [nodeInfo, setNode] = useState<NodeResponse.NodeInfo>({});
  const params = useParams()
  const intl = useIntl()
  const [loading, setLoading] = useState(true);
  const access = useAccess();
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const columns: ProColumns<NodeResponse.NodeInfo>[] = [
    {
      title: intl.formatMessage({id: 'assets.node.table.column.id'}),
      dataIndex: 'id',
      hideInSearch: true,
      width: 80,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.name'}),
      dataIndex: 'name',
      width: 100,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.cnName'}),
      dataIndex: 'cnName',
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.operator'}),
      dataIndex: 'operator',
      valueType: 'select',
      valueEnum: nodeOperatorFilter,
      choices: (value: number) => nodeOperatorFilter[value].text
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.status'}),
      dataIndex: 'status',
      valueType: 'select',
      sorter: (a: NodeResponse.NodeInfo, b: NodeResponse.NodeInfo) => a.status - b.status,
      valueEnum: nodeStatusFilter,
      choices: (value: number) => nodeStatusFilter[value].text
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.attribute'}),
      dataIndex: 'attribute',
      valueType: 'select',
      valueEnum: nodeAttributeFilter,
      choices: (value: number) => nodeAttributeFilter[value].text,
      render: (_, record) => {
        return <Tag color="processing">{nodeAttributeConvert[record.attribute]}</Tag>
      }
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.grade'}),
      dataIndex: 'grade',
      valueType: 'select',
      valueEnum: nodeGradeFilter,
      choices: (value: number) => nodeGradeFilter[value].text,
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.region'}),
      dataIndex: 'region',
      valueType: 'select',
      valueEnum: regionFilter,
      choices: (value: number) => regionFilter[value].text,
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.province'}),
      dataIndex: 'province',
      valueType: 'select',
      fieldProps: {
        showSearch: true
      },
      valueEnum: provinceFilter,
      choices: (value: number) => provinceFilter[value].text,
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.contract'}),
      dataIndex: 'contract',
      valueType: 'select',
      valueEnum: nodeContractFilter,
      choices: (value: number) => nodeContractFilter[value].text,
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.bandwidth'}),
      dataIndex: 'bandwidth',
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.productLines'}),
      dataIndex: 'productLines',
      valueType: 'treeSelect',
      choices: (value: any) => {
        return value.map((item, index)=>{
          return item.fullNamePath
        })
      },
      render: (_, record) => {
        return <Flex wrap="wrap" gap="small">
          {record.productLines.map((item, index)=>(
            <Tag style={{cursor: 'pointer'}} onClick={()=>{history.push(`/assets/hosts/server-tree/${item.id}/machine`)}} key={index}>{item.fullNamePath}</Tag>
          ))}
        </Flex>
      }
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.isDeleted'}),
      dataIndex: 'isDeleted',
      hideInTable: true,
      valueType: 'select',
      valueEnum: nodeIsDeletedFilter,
      choices: (value: number) => nodeIsDeletedFilter[value].text
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.creator'}),
      dataIndex: 'creator',
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.comment'}),
      dataIndex: 'comment',
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.createTime'}),
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      choices: (value: string) => moment(value).format("YYYY-MM-DD hh:mm:ss")
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.updateTime'}),
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      choices: (value: string) => moment(value).format("YYYY-MM-DD hh:mm:ss")
    }
  ]

  useEffect(()=>{
    setLoading(true)
    queryNode(params.nodeId).then((res=>{
      if (res.success) {
        setLoading(false)
        setNode(res.data.list)
      } else {
        message.error(res.errorMessage)
      }
    }))
  }, [])
  return (
    <Access
      accessible={checkUserHavePageReadPermissions(assetsNodePermissionsMenuKeys, access, userMenuPermissions)}
      fallback={<ForbiddenPage/>}>
      <PageContainer
        header={{
          title: <ButterflyTitle name={nodeInfo.cnName}/> || "-",
          ghost: true,
          style: {
            backgroundColor: "#fff",
            margin: "0 24px",
            marginTop: 24
          }
        }}
        tabList={[
          {
            tab: intl.formatMessage({id: 'assets.node.detail.tabList.log.title'}),
            key: 'log',
          },
        ]}
        content={<ProDescriptions
                title={false}
                loading={loading}
                column={3}
                columns={columns}
                dataSource={nodeInfo} />
      }
      >
        <ProCard style={{borderRadius: 0}} bordered={false} >
          { loading ? <Loading/> : <OperateLog/> }
        </ProCard>
      </PageContainer>
    </Access>
  )
}
