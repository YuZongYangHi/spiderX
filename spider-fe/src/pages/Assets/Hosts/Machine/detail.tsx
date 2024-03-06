import "./detail.less"
import {useParams} from "umi";
import React, {useEffect, useState} from "react";
import {queryServerById} from "@/services/Assets/Server/api";
import {ServerResponse} from '@/services/Assets/Server/typings'
import {PageContainer, ProCard, ProDescriptions} from '@ant-design/pro-components'
import {Button, Flex, Tag} from 'antd'
import {useAccess, useModel, Access, history} from "umi";
import {checkUserHavePageReadPermissions, assetsHostPermissionsMenuKeys} from '@/access'
import ForbiddenPage from "@/pages/403";
import ButterflyTitle from "@/components/ButterflyTitle";
import {useIntl} from "@@/exports";
import Loading from "@/components/Loading";
import OperateLog from "@/pages/Assets/Nodes/logs";
import {RollbackOutlined} from '@ant-design/icons'
import {ComponentTitle} from "@/components/CustonizeTitle";
import columnConvert from "@/util/ProTableColumnConvert";
import {
  IdcAzStatusFilter, IdcRoomBearerTypeFilter, IdcRoomBearWeightFilter,
  IdcRoomPduStandardFilter, IdcRoomPowerModeFilter, IdcRoomRackSizeFilter,
  nodeIsDeletedFilter,
  nodeOperatorFilter,
  nodeStatusFilter
} from "@/util/dataConvert";

export default () => {
  const params = useParams();
  const [data, setData] = useState<ServerResponse.ServerInfo>({});
  const access = useAccess();
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const [loading, setLoading] = useState(true);
  const intl = useIntl()
  const {setMachineClickTree} = useModel('tree')

  useEffect(()=>{
    queryServerById(params.serverId).then(res=>{
      setData(res.data.list)
      setLoading(false)
    })
  }, [])

  return (
    <Access
      accessible={checkUserHavePageReadPermissions(assetsHostPermissionsMenuKeys, access, userMenuPermissions)}
      fallback={<ForbiddenPage/>}>
      {loading ? <Loading/> :
        <PageContainer
          breadcrumb={{
           items: [
             {
               title: "SN"
             },
             {
               title: data.sn ? data.sn : ""
             }, {
              title: intl.formatMessage({id: 'assets.hosts.detail.breadcrumb.detail'})
             }
           ]
          }}
          header={{
            title: <ButterflyTitle name={data.hostname}/> || "-",
            ghost: true,
            style: {
              borderRadius: 6,
              backgroundColor: "#fff",
             // marginLeft: 29,
              marginRight: 81,
              //marginBottom: 12
            }
          }}
          extra={
          <>
          <Button
            onClick={()=>history.push(`/assets/hosts/server-tree/${params.treeId}/machine`)}
            icon={<RollbackOutlined />}
            type="primary"
            key="back" >{intl.formatMessage({id: 'assets.hosts.detail.return'})}</Button>
          </>
          }
          tabList={[
            {
              tab: intl.formatMessage({id: 'assets.node.detail.tabList.log.title'}),
              key: 'log',
            },
            {
              tab: intl.formatMessage({id: 'ticket.workflow.log'}),
              key: 'ticket'
            }
          ]}
          content={
          <>
            <ProDescriptions
              title={<ComponentTitle title={intl.formatMessage({id: 'pages.detail.basic.title'})}/>}
              column={3}>
              <ProDescriptions.Item label={intl.formatMessage({id: "assets.hosts.column.id"})}>
                {data.id}
              </ProDescriptions.Item>
              <ProDescriptions.Item copyable={true} label={intl.formatMessage({id: "assets.hosts.column.sn"})}>
                {data.sn}
              </ProDescriptions.Item>
              <ProDescriptions.Item ellipsis={true} copyable={true} label={intl.formatMessage({id: "assets.hosts.column.hostname"})}>
                {data.hostname}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "assets.hosts.column.type"})}>
                <Tag bordered={false} color="processing">{columnConvert["assets.machine.type"][data.type].text}</Tag>
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "assets.hosts.column.status"})}>
                <Tag bordered={false} color={nodeStatusFilter[data.status].color}>{nodeStatusFilter[data.status].text}</Tag>
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.node.table.column.productLines'})}>
                <Flex wrap="wrap" gap="small">
                  {data.productLines.map((item, index)=>(
                    <Tag style={{cursor: 'pointer'}} onClick={()=>{
                      setMachineClickTree(item.id)
                      history.push(`/assets/hosts/server-tree/${item.id}/machine`)}} key={index}>{item.fullNamePath}</Tag>
                  ))}
                </Flex>
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.node.table.column.name'})}>
                <Tag color="#2db7f5">{data.node.name}</Tag>
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.role'})}>
                <Tag bordered={false} color={columnConvert["assets.machine.role"][data.role].color}>{columnConvert["assets.machine.role"][data.role].text}</Tag>
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.powerInfo'})}>
                {data.powerInfo}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.powerCost'})}>
                {data.powerCost}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.appEnv'})}>
                {data.appEnv}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.appEnvDesc'})}>
                {data.appEnvDesc}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.belongTo'})}>
                {data.belongTo}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.belongToDesc'})}>
                {data.belongToDesc}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.tag'})}>
                {data.tags.map(item => (
                   <Tag key={item.id}>{item.name}</Tag>
                ))}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.creator'})}>
                {data.creator}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.systemType'})}>
                {data.systemType}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.systemVersion'})}>
                {data.systemVersion}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.systemArch'})}>
                {data.systemArch}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.arrivalTime'})} valueType="dateTime">
                {data.arrivalTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.overdueTime'})} valueType="dateTime">
                {data.overdueTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item  valueType="dateTime" label={intl.formatMessage({id: 'assets.hosts.column.createTime'})}>
                {data.createTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="dateTime" label={intl.formatMessage({id: 'assets.hosts.column.updateTime'})}>
                {data.updateTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.isDeleted'})}>
                {nodeIsDeletedFilter[data.isDeleted].text}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "assets.hosts.column.comment"})}>
                {data.comment}
              </ProDescriptions.Item>
            </ProDescriptions>
            <br/>
            <ProDescriptions title={<ComponentTitle title={intl.formatMessage({id: 'pages.detail.network.title'})}/>} column={3}>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.pubNetIp'})}>
                {data.pubNetIp}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.pubNetMask'})}>
                {data.pubNetMask}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.pubNetGw'})}>
                {data.pubNetGw}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.privNetIp'})}>
                {data.privNetIp}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.privNetMask'})}>
                {data.privNetMask}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.privNetGw'})}>
                {data.privNetGw}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.mgmtPortIp'})}>
                {data.mgmtPortIp}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.mgmtPortMask'})}>
                {data.mgmtPortMask}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.mgmtPortGw'})}>
                {data.mgmtPortGw}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'assets.hosts.column.operator'})}>
                <Tag bordered={false}>{nodeOperatorFilter[data.operator].text}</Tag>
              </ProDescriptions.Item>
            </ProDescriptions>
            <br/>
            <ProDescriptions column={3} title={<ComponentTitle title={intl.formatMessage({id: "assets.hosts.detail.az.title"})}/>}>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.physics.name"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.physicsAz.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.physics.cnName"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.physicsAz.cnName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.physics.status"})} valueEnum={IdcAzStatusFilter}>
                {data.idcRackSlot.idcRack.idcRoom.idc.physicsAz.status}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.virtual.name"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.virtualAz.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.virtual.cnName"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.virtualAz.cnName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.virtual.status"})} valueEnum={IdcAzStatusFilter}>
                {data.idcRackSlot.idcRack.idcRoom.idc.virtualAz.status}
              </ProDescriptions.Item>
            </ProDescriptions>
            <br/>
            <ProDescriptions title={<ComponentTitle title={intl.formatMessage({id: 'assets.hosts.detail.idc.title'})}/>} column={3}>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.column.name"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.column.cnName"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.cnName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.column.status"})} valueEnum={IdcAzStatusFilter}>
                {data.idcRackSlot.idcRack.idcRoom.idc.status}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.idc.column.cabinetNum"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.cabinetNum}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.idc.column.address"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.address}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.idc.column.idcPhone"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.idcPhone}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.idc.column.idcMail"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.idcMail}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.column.region"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.virtualAz.region}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.column.province"})}>
                {data.idcRackSlot.idcRack.idcRoom.idc.virtualAz.province}
              </ProDescriptions.Item>
            </ProDescriptions>
            <br/>
            <ProDescriptions column={3} title={<ComponentTitle title={intl.formatMessage({id: "assets.hosts.detail.idcRoom.title"})}/>}>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.room.column.roomName"})}>
                {data.idcRackSlot.idcRack.idcRoom.roomName}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.room.column.pduStandard"})} valueEnum={IdcRoomPduStandardFilter}>
                {data.idcRackSlot.idcRack.idcRoom.pduStandard}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.room.column.status"})} valueEnum={IdcAzStatusFilter}>
                {data.idcRackSlot.idcRack.idcRoom.status}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.room.column.powerMode"})} valueEnum={IdcRoomPowerModeFilter}>
                {data.idcRackSlot.idcRack.idcRoom.powerMode}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.room.column.rackSize"})} valueEnum={IdcRoomRackSizeFilter}>
                {data.idcRackSlot.idcRack.idcRoom.rackSize}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.room.column.bearerType"})} valueEnum={IdcRoomBearerTypeFilter}>
                {data.idcRackSlot.idcRack.idcRoom.bearerType}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.room.column.bearWeight"})} valueEnum={IdcRoomBearWeightFilter}>
                {data.idcRackSlot.idcRack.idcRoom.bearWeight}
              </ProDescriptions.Item>
            </ProDescriptions>
            <br/>
            <ProDescriptions column={3} title={<ComponentTitle title={intl.formatMessage({id: "assets.hosts.detail.idcRack.title"})}/>}>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.column.name"})}>
                {data.idcRackSlot.idcRack.name}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.column.row"})}>
                {data.idcRackSlot.idcRack.row}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.column.col"})}>
                {data.idcRackSlot.idcRack.col}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.column.group"})}>
                {data.idcRackSlot.idcRack.group}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.column.uNum"})}>
                {data.idcRackSlot.idcRack.uNum}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.room.column.status"})} valueEnum={IdcAzStatusFilter}>
                {data.idcRackSlot.idcRack.status}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.column.ratedPower"})}>
                {data.idcRackSlot.idcRack.ratedPower}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.column.netUNum"})}>
                {data.idcRackSlot.idcRack.netUNum}
              </ProDescriptions.Item>

              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.column.current"})}>
                {data.idcRackSlot.idcRack.current}
              </ProDescriptions.Item>
            </ProDescriptions>
            <br/>
            <ProDescriptions column={3} title={<ComponentTitle title={intl.formatMessage({id: "assets.hosts.detail.idcRackSlot.title"})}/>}>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.slot.column.fullName"})}>
                {`${data.idcRackSlot.idcRack.idcRoom.idc.name}_${data.idcRackSlot.idcRack.idcRoom.roomName}_${data.idcRackSlot.idcRack.name}_${data.idcRackSlot.slot}`}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.slot.column.type"})}>
                {data.idcRackSlot.idcRack.current}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.slot.column.status"})} valueEnum={IdcAzStatusFilter}>
                {data.idcRackSlot.status}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.slot.column.slot"})}>
                {data.idcRackSlot.slot}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.slot.column.port"})}>
                {data.idcRackSlot.port}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.rack.slot.column.uNum"})}>
                {data.idcRackSlot.uNum}
              </ProDescriptions.Item>
            </ProDescriptions>
            <br/>
            <ProDescriptions column={3} title={<ComponentTitle title={intl.formatMessage({id: 'assets.hosts.detail.factory.title'})}/>}>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.column.id"})}>
                {data.factory.id}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.factory.column.name"})}>
                {data.factory.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.factory.column.enName"})}>
                {data.factory.enName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.factory.column.cnName"})}>
                {data.factory.cnName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.factory.column.modeName"})}>
                {data.factory.modeName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.column.creator"})}>
                {data.factory.creator}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.column.createTime"})} valueType='dateTime'>
                {data.factory.createTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.column.updateTime"})} valueType='dateTime'>
                {data.factory.updateTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.factory.column.description"})} valueType='dateTime'>
                {data.factory.description}
              </ProDescriptions.Item>
            </ProDescriptions>
            <br/>
            <ProDescriptions column={3} title={<ComponentTitle title={intl.formatMessage({id: 'assets.hosts.detail.provider.title'})}/>}>
              <ProDescriptions.Item label={intl.formatMessage({id: 'idc.column.id'})}>
                {data.provider.id}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'idc.provider.column.name'})}>
                {data.provider.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'idc.provider.column.alias'})}>
                {data.provider.alias}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'idc.column.creator'})}>
                {data.provider.creator}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'idc.column.createTime'})} valueType="dateTime">
                {data.provider.createTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: 'idc.column.updateTime'})} valueType="dateTime">
                {data.provider.updateTime}
              </ProDescriptions.Item>
            </ProDescriptions>
            <br/>
            <ProDescriptions title={<ComponentTitle title={intl.formatMessage({id: 'pages.detail.suit.title'})}/>} column={3}>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.suit.column.id"})}>
                {data.suit.id}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.suit.column.name"})}>
                {data.suit.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.suit.season.column.name"})}>
                {data.suit.season}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.suit.column.cpu"})}>
                {data.suit.cpu}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.suit.column.memory"})}>
                {data.suit.memory}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.suit.column.storage"})}>
                {data.suit.storage}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.suit.column.gpu"})}>
                {data.suit.gpu}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.suit.column.raid"})}>
                {data.suit.raid}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={intl.formatMessage({id: "idc.suit.column.type"})}>
                {data.suit.type}
              </ProDescriptions.Item>
            </ProDescriptions>
          </>
          }
        >
          <ProCard bodyStyle={{width: "100%"}} className="server-detail-body" style={{borderRadius: 6}} bordered={false} >
            { loading ? <Loading/> :
              <OperateLog resourceId={params.serverId} resourceName={"server"} />
            }
          </ProCard>
        </PageContainer>
      }
    </Access>
  )
}
