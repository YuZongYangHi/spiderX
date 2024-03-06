import "./index.css"
import {ActionType, ColumnsState, ProTable, ProCard, ProColumns, TableDropdown} from '@ant-design/pro-components'
import {useModel, useIntl, useParams} from "umi";
import React, {useEffect, useRef, useState} from "react";
import {
  queryServerByTreeId, deleteServer,
  multiDeleteServer, multiUploadServer, ServerTreeMigrate
} from "@/services/Assets/Server/api";
import {queryIdcSuitList, queryIdcProviderList, queryIdcFactoryList} from "@/services/Idc/idc";
import {queryNodeList} from "@/services/Assets/Node/api";
import {
  Flex,
  Upload,
  UploadFile,
  UploadProps,
  Tag,
  TableProps,
  SorterResult,
  Radio,
  Input,
  RadioChangeEvent
} from "antd";
import {clickExtender} from "@/components/Style/style";
import {ServerTreeMigrateForm} from './migrate'
import DesignProModalForm from "@/components/ProModal";
import {
  assetsHostPermissionsMenuKeys,
  checkUserCreatePermissions,
  checkUserHavePageReadPermissions,
  checkUserUpdatePermissions,
  checkUserDeletePermissions
} from "@/access";
import ForbiddenPage from "@/pages/403";
import Loading from "@/components/Loading";
import {Button, Checkbox, message, Modal, Space, Alert} from "antd";
import {DownOutlined, ExclamationCircleFilled, InboxOutlined, UploadOutlined, DeleteOutlined, NodeIndexOutlined, BugOutlined  } from "@ant-design/icons";
import {Access, history, useAccess} from "@@/exports";
import moment from "moment";
import {SortOrder, FilterValue} from "antd/lib/table/interface";
import fetchUtil from "@/util/ProTableRequest";
import {fetchParamsType} from "@/util/ProTableRequest/type";
import ExportJsonExcel from "js-export-excel"
import columnConvert from '@/util/ProTableColumnConvert'
import {queryServiceTreeList} from "@/services/Assets/ServiceTree/api";
import {buildTree} from "@/util/Tree/tree";
import {
  IdcAzStatusFilter,
  IdcRackSlotTypeFilter,
  IdcRoomBearerTypeFilter, IdcRoomBearWeightFilter,
  IdcRoomPduStandardFilter,
  IdcRoomPowerModeFilter,
  IdcRoomRackSizeFilter, nodeIsDeletedFilter,
  nodeOperatorFilter,
  nodeStatusFilter
} from "@/util/dataConvert";
import {RemoteRequestSelectSearch} from "@/handler/Request/request";
import Marquee from 'react-fast-marquee';

const { confirm } = Modal;
const { Dragger } = Upload;

export default () => {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult>({});
  const {treeRawList, setTreeRawList, currentTree, setCurrentTree, setMachineClickTree} = useModel('tree')
  const access = useAccess();
  const intl = useIntl()
  const params = useParams()
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const tableRef = useRef();
  const [currentRow, setCurrentRow] = useState<IdcResponse.AzInfo>();
  const [migrateRow, setMigrateRow] = useState<ServerRequest.TreeMigrate>({});
  const {treeId, setTreeId} = useModel('machine')
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const actionRef = useRef<ActionType>();
  const [multiUploadOpen, setMultiUploadOpen] = useState(false);
  const [multiUploadConfirm, setMultiUploadConfirm] = useState(false);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [uploadFileDisable, setUploadFileDisbled] = useState(false);
  const [selectRowValues, setSelectRowValues] = useState<NodeResponse.NodeInfo[]>([]);
  const [polling, setPolling] = useState<number>(0);
  const [productLines, setProductLines] = useState([])
  const [data, setData] = useState<NodeResponse.NodeInfo[]>([]);
  const [searchSuitName, setSuitName] = useState("");
  const [searchProviderName, setProvider] = useState("");
  const [searchFactoryName, setFactoryName] = useState("");
  const [searchNodeName, setNodeName] = useState("");
  const proModalUpdateRef = useRef(null);
  const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);
  const [deleteModalLoading, setDeleteModalLoading] = useState(false)
  const [multiSearchParams, setMultiSearchParams] = useState({})
  const [multiSearchVisable, setMultiSearchVisable] = useState(false);
  const [multiSearchLoading, setMultiSearchLoading] = useState(false);
  const [multiSearchFieldType, setMultiSearchFieldType] = useState("multiSearchFieldSn");
  const [multiSearchContent, setMultiSearchContent] = useState("");

  const fetchParams: fetchParamsType = {
    requestQueryFieldOptions: [
      "sn", "hostname", "type", "suitId",
      "role", "operator", "providerId",
      "factoryId", "nodeId", "idcRackSlotId",
      "status", "appEnv", "privNetIp",
      "pubNetIp", "mgmtPortIp", "creator",
      "productLines", "isDeleted", "tag",
      "multiSearchFieldSn",
      "multiSearchFieldHostname",
      "multiSearchFieldPubIp",
      "multiSearchFieldPrivIp",
      "multiSearchFieldMgmtIp"
    ],
    requestQuery: {},
    requestParams: [],
    fetch: queryServerByTreeId
  }

  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    suitId: {
      show: false,
    },
    suitSeason: {
      show: false,
    },
    suitType: {
      show: false,
    },
    suitCpu: {
      show: false,
    },
    suitMemory: {
      show: false
    },
    suitStorage: {
      show: false
    },
    suitGpu: {
      show: false
    },
    suitRaid: {
      show: false
    },
    providerId: {
      show: false
    },
    providerAlias: {
      show: false
    },
    factoryId: {
      show: false
    },
    factoryEnName: {
      show: false
    },
    factoryCnName: {
      show: false
    },
    factoryModeName: {
      show: false
    },
    nodeCnName: {
      show: false
    },
    nodeRegion: {
      show: false
    },
    nodeProvince: {
      show: false
    },
    idcRackSlotType: {
      show: false
    },
    idcRackSlotUNum: {
      show: false
    },
    idcRackSlotPort: {
      show: false
    },
    idcRackSlotStatus: {
      show: false
    },
    idcRackSlotSlot: {
      show: false
    },
    idcRackName: {
      show: false
    },
    idcRackRow: {
      show: false
    },
    idcRackCol: {
      show: false
    },
    idcRackGroup: {
      show: false
    },
    idcRackUNum: {
      show: false
    },
    idcRackRatedPower: {
      show: false
    },
    idcRackNetUNum: {
      show: false
    },
    idcRackCurrent: {
      show: false
    },
    idcRackStatus: {
      show: false
    },
    idcRoomName: {
      show: false
    },
    idcRoomPduStandard: {
      show: false
    },
    idcRoomPowerMode: {
      show: false
    },
    idcRoomRackSize: {
      show: false
    },
    idcRoomBearerType: {
      show: false
    },
    idcRooBearWeight: {
      show: false
    },
    idcRoomStatus: {
      show: false
    },
    idcName: {
      show: false
    },
    idcCnName: {
      show: false
    },
    physicsName: {
      show: false
    },
    virtualName: {
      show: false
    },
    idcStatus: {
      show: false
    },
    idcAddress: {
      show: false
    },
    idcRegion: {
      show: false
    },
    idcCity: {
      show: false
    },
    idcCabinetNum: {
      show: false
    },
    idcPhone: {
      show: false
    },
    idcMail: {
      show: false
    },
    tag: {
      show: false
    }
  });

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({id: "assets.hosts.column.id"}),
      dataIndex: "id",
      hideInSearch: true,
      width: 50,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.sn"}),
      dataIndex: "sn",
      width: 60,
      fixed: 'left',
      copyable: true,
      ellipsis: true
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.hostname"}),
      dataIndex: "hostname",
      width: 80,
      fixed: 'left',
      copyable: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.type"}),
      dataIndex: "type",
      valueType: 'select',
      valueEnum: columnConvert["assets.machine.type"],
      hideInSearch: true,
      filters: true,
      onFilter: true,
      sorter: (a, b) => a.type - b.type,
      sortOrder: sortedInfo.columnKey === 'type' ? sortedInfo.order : null,
      filteredValue: filteredInfo.type || null,
      width: 120,
      choices: (value: number, record) => columnConvert["assets.machine.type"][record.type].text,
      render: (_, record) => <Tag bordered={false} color="processing">{columnConvert["assets.machine.type"][record.type].text}</Tag>
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.status'}),
      dataIndex: "status",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.status - b.status,
      hideInSearch: true,
      valueType: 'select',
      filters: true,
      onFilter: true,
      valueEnum: nodeStatusFilter,
      sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
      filteredValue: filteredInfo.status || null,
      width: 120,
      choices: (value: number, record) => nodeStatusFilter[record.status].text,
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.productLines'}),
      dataIndex: 'productLines',
      valueType: 'treeSelect',
      hideInSearch: true,
      fieldProps: {
        options: productLines,
        fieldNames: {
          children: 'children',
          label: 'name',
          value: 'id',
        },
        showSearch: true,
        autoClearSearchValue: true,
        filterTreeNode: true,
        multiple: true,
        treeNodeFilterProp: 'id',
        treeNodeLabelProp: 'fullNamePath'
      },
      width: 190,
      choices: (value: any) => {
        return value.map((item, index)=>{
          return item.fullNamePath
        })
      },
      render: (_, record) => {
        return <Flex wrap="wrap" gap="small">
          {record.productLines.map((item, index)=>(
            <Tag style={{cursor: 'pointer'}} onClick={()=>{
              setMachineClickTree(item.id)
              history.push(`/assets/hosts/server-tree/${item.id}/machine`)}} key={index}>{item.fullNamePath}</Tag>
          ))}
        </Flex>
      }
    },{
      title: intl.formatMessage({id: 'assets.hosts.column.pubNetIp'}),
      dataIndex: "pubNetIp",
      defaultSortOrder: 'ascend',
      sortOrder: sortedInfo.columnKey === 'pubNetIp' ? sortedInfo.order : null,
      width: 120,
      sorter: (a, b) =>  a.pubNetIp && b.pubNetIp ? Number(a.pubNetIp.split('.')[3]) - Number(b.pubNetIp.split('.')[3]) : null,
    },{
      title: intl.formatMessage({id: 'assets.hosts.column.privNetIp'}),
      dataIndex: "privNetIp",
      defaultSortOrder: 'ascend',
      sortOrder: sortedInfo.columnKey === 'privNetIp' ? sortedInfo.order : null,
      width: 120,
      sorter: (a, b) =>  a.privNetIp && b.privNetIp ? Number(a.privNetIp.split('.')[3]) - Number(b.privNetIp.split('.')[3]) : null,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.mgmtPortIp'}),
      dataIndex: "mgmtPortIp",
      defaultSortOrder: 'ascend',
      sortOrder: sortedInfo.columnKey === 'mgmtPortIp' ? sortedInfo.order : null,
      width: 120,
      sorter: (a, b) =>  a.mgmtPortIp && b.mgmtPortIp ? Number(a.mgmtPortIp.split('.')[3]) - Number(b.mgmtPortIp.split('.')[3]) : null,
    },{
      title: intl.formatMessage({id: 'assets.node.table.column.name'}),
      dataIndex: "nodeId",
      render: (_, record) => <Tag color="#2db7f5">{record.node.name}</Tag>,
      width: 120,
      request: () => {
        const p: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {},
          request: queryNodeList
        }

        if (searchNodeName !== "") {
          p.params["filter"] = `name=${searchNodeName}`
        }
        return RemoteRequestSelectSearch(p)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setNodeName(value)
        }
      },
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.cnName'}),
      dataIndex: "nodeCnName",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.node.cnName,
      render: (_, record) => record.node.cnName
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.region'}),
      dataIndex: "nodeRegion",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.node.region,
      render: (_, record) => record.node.region
    },
    {
      title: intl.formatMessage({id: 'assets.node.table.column.province'}),
      dataIndex: "nodeProvince",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.node.province,
      render: (_, record) => record.node.province
    },

    {
      title: intl.formatMessage({id: 'assets.hosts.column.role'}),
      dataIndex: "role",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.role - b.role,
      hideInSearch: true,
      valueType: 'select',
      filters: true,
      onFilter: true,
      width: 120,
      valueEnum: columnConvert["assets.machine.role"],
      sortOrder: sortedInfo.columnKey === 'role' ? sortedInfo.order : null,
      filteredValue: filteredInfo.role || null,
      choices: (value: number, record) => columnConvert["assets.machine.role"][record.role].text,
      render: (_, record) => <Tag bordered={false} color={columnConvert["assets.machine.role"][record.role].color}>{columnConvert["assets.machine.role"][record.role].text}</Tag>
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.operator'}),
      dataIndex: "operator",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.operator - b.operator,
      hideInSearch: true,
      valueType: 'select',
      filters: true,
      onFilter: true,
      width: 120,
      valueEnum: nodeOperatorFilter,
      sortOrder: sortedInfo.columnKey === 'operator' ? sortedInfo.order : null,
      filteredValue: filteredInfo.operator || null,
      choices: (value: number, record) => nodeOperatorFilter[record.operator].text,
      render: (_, record) => <Tag bordered={false}>{nodeOperatorFilter[record.operator].text}</Tag>
    }, {
      title: intl.formatMessage({id: 'assets.hosts.column.tag'}),
      dataIndex: "tag",
      hideInSearch: true,
      width: 190,
      choices: (value: any, record: any) => {
        return record.tags.map((item, index)=>{
          return item.name
        })
      },
      render: (_, record) => {
        return <Flex wrap="wrap" gap="small">
          {record.tags.map((item, index)=>(
            <Tag key={index}>{item.name}</Tag>
          ))}
        </Flex>
      }
    },{
      title: intl.formatMessage({id: 'assets.hosts.column.appEnv'}),
      dataIndex: "appEnv",
      hideInSearch: true,
      valueType: 'select',
      valueEnum: columnConvert["assets.machine.appEnv"],
      filters: true,
      onFilter: true,
      filteredValue: filteredInfo.appEnv || null,
      choices: (value: number, record) => columnConvert["assets.machine.appEnv"].text,
      width: 120,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.appEnvDesc'}),
      dataIndex: "appEnvDesc",
      width: 160,
      hideInSearch: true,
      ellipsis: true,
      choices: (value: number, record) => record.appEnvDesc,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.belongTo'}),
      dataIndex: "belongTo",
      hideInSearch: true,
      valueType: 'select',
      valueEnum: columnConvert["assets.machine.belongTo"],
      filters: true,
      onFilter: true,
      filteredValue: filteredInfo.belongTo || null,
      width: 120,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.belongToDesc'}),
      dataIndex: "belongToDesc",
      width: 160,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.privNetMask'}),
      dataIndex: "privNetMask",
      width: 160,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.privNetGw'}),
      dataIndex: "privNetGw",
      width: 160,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.pubNetMask'}),
      dataIndex: "pubNetMask",
      width: 160,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.pubNetGw'}),
      dataIndex: "pubNetGw",
      width: 160,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.mgmtPortMask'}),
      dataIndex: "mgmtPortMask",
      width: 160,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.mgmtPortGw'}),
      dataIndex: "mgmtPortGw",
      width: 160,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.systemType'}),
      dataIndex: "systemType",
      width: 160,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.systemVersion'}),
      dataIndex: "systemVersion",
      width: 160,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.systemArch'}),
      dataIndex: "systemArch",
      width: 160,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.powerInfo'}),
      dataIndex: "powerInfo",
      ellipsis: true,
      width: 160,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.powerCost'}),
      dataIndex: "powerCost",
      width: 160,
      ellipsis: true,
      hideInSearch: true,
    }, {
      title: intl.formatMessage({id: 'idc.suit.column.name'}),
      dataIndex: "suitId",
      width: 160,
      request: () => {
        const p: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {},
          request: queryIdcSuitList
        }

        if (searchSuitName !== "") {
          p.params["filter"] = `name=${searchSuitName}`
        }
        return RemoteRequestSelectSearch(p)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setSuitName(value)
        }
      },
      render: (_, record) => record.suit.name
    },
    {
      title: intl.formatMessage({id: 'idc.suit.column.season'}),
      dataIndex: "suitSeason",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.suit.season,
      render: (_, record) => record.suit.season
    },
    {
      title: intl.formatMessage({id: 'idc.suit.column.type'}),
      dataIndex: "suitType",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.suit.type,
      render: (_, record) => record.suit.type
    },
    {
      title: intl.formatMessage({id: 'idc.suit.column.cpu'}),
      dataIndex: "suitCpu",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.suit.cpu,
      render: (_, record) => record.suit.cpu
    },
    {
      title: intl.formatMessage({id: 'idc.suit.column.memory'}),
      dataIndex: "suitMemory",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.suit.memory,
      render: (_, record) => record.suit.memory
    },
    {
      title: intl.formatMessage({id: 'idc.suit.column.storage'}),
      dataIndex: "suitStorage",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.suit.storage,
      render: (_, record) => record.suit.storage
    },
    {
      title: intl.formatMessage({id: 'idc.suit.column.gpu'}),
      dataIndex: "suitGpu",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.suit.gpu,
      render: (_, record) => record.suit.gpu
    },
    {
      title: intl.formatMessage({id: 'idc.suit.column.raid'}),
      dataIndex: "suitRaid",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.suit.raid,
      render: (_, record) => record.suit.raid
    },
    {
      title: intl.formatMessage({id: 'idc.provider.column.name'}),
      dataIndex: "providerId",
      width: 160,
      request: () => {
        const p: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {},
          request: queryIdcProviderList
        }

        if (searchProviderName !== "") {
          p.params["filter"] = `name=${searchProviderName}`
        }
        return RemoteRequestSelectSearch(p)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setProvider(value)
        }
      },
      choices: (value: number, record) =>record.provider.name,
      render: (_, record) => record.provider.name
    },
    {
      title: intl.formatMessage({id: 'idc.provider.column.alias'}),
      dataIndex: "providerAlias",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) =>record.provider.alias,
      render: (_, record) => record.provider.alias
    },
    {
      title: intl.formatMessage({id: 'idc.factory.column.name'}),
      dataIndex: "factoryId",
      width: 160,
      request: () => {
        const p: handlerRequest.RemoteSelectSearchParams = {
          option: {
            label: "name",
            value: "id"
          },
          params: {},
          request: queryIdcFactoryList
        }

        if (searchFactoryName !== "") {
          p.params["filter"] = `name=${searchFactoryName}`
        }
        return RemoteRequestSelectSearch(p)
      },
      fieldProps: {
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setFactoryName(value)
        }
      },
      choices: (value: number, record) => record.factory.name,
      render: (_, record) => record.factory.name
    },
    {
      title: intl.formatMessage({id: 'idc.factory.column.enName'}),
      dataIndex: "factoryEnName",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.factory.enName,
      render: (_, record) => record.factory.enName
    },
    {
      title: intl.formatMessage({id: 'idc.factory.column.cnName'}),
      dataIndex: "factoryCnName",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.factory.cnName,
      render: (_, record) => record.factory.cnName
    },
    {
      title: intl.formatMessage({id: 'idc.factory.column.modeName'}),
      dataIndex: "factoryModeName",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.factory.modeName,
      render: (_, record) => record.factory.modeName
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackSlotType'}),
      dataIndex: "idcRackSlotType",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => IdcRackSlotTypeFilter[record.idcRackSlot.type].text,
      render: (_, record) => IdcRackSlotTypeFilter[record.idcRackSlot.type].text
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackSlotUNum'}),
      dataIndex: "idcRackSlotUNum",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.uNum,
      render: (_, record) => record.idcRackSlot.uNum
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackSlotPort'}),
      dataIndex: "idcRackSlotPort",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.port,
      render: (_, record) => record.idcRackSlot.port
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackSlotStatus'}),
      dataIndex: "idcRackSlotStatus",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) =>  IdcAzStatusFilter[record.idcRackSlot.status].text,
      render: (_, record) => IdcAzStatusFilter[record.idcRackSlot.status].text
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackSlotSlot'}),
      dataIndex: "idcRackSlotSlot",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.slot,
      render: (_, record) => record.idcRackSlot.slot
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackName'}),
      dataIndex: "idcRackName",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.name,
      render: (_, record) => record.idcRackSlot.idcRack.name
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackRow'}),
      dataIndex: "idcRackRow",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.row,
      render: (_, record) => record.idcRackSlot.idcRack.row
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackCol'}),
      dataIndex: "idcRackCol",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.col,
      render: (_, record) => record.idcRackSlot.idcRack.col
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackGroup'}),
      dataIndex: "idcRackGroup",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.group,
      render: (_, record) => record.idcRackSlot.idcRack.group
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackUNum'}),
      dataIndex: "idcRackUNum",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.uNum,
      render: (_, record) => record.idcRackSlot.idcRack.uNum
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackRatedPower'}),
      dataIndex: "idcRackRatedPower",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) =>  record.idcRackSlot.idcRack.ratedPower,
      render: (_, record) => record.idcRackSlot.idcRack.ratedPower
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackNetUNum'}),
      dataIndex: "idcRackNetUNum",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) =>  record.idcRackSlot.idcRack.netUNum,
      render: (_, record) => record.idcRackSlot.idcRack.netUNum
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackCurrent'}),
      dataIndex: "idcRackCurrent",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) =>  record.idcRackSlot.idcRack.current,
      render: (_, record) => record.idcRackSlot.idcRack.current
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRackStatus'}),
      dataIndex: "idcRackStatus",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => IdcAzStatusFilter[record.idcRackSlot.idcRack.status].text,
      render: (_, record) => IdcAzStatusFilter[record.idcRackSlot.idcRack.status].text
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcRoomName"}),
      dataIndex: "idcRoomName",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.idcRoom.roomName,
      render: (_, record) => record.idcRackSlot.idcRack.idcRoom.roomName
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.idcRoomPduStandard'}),
      dataIndex: "idcRoomPduStandard",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => IdcRoomPduStandardFilter[record.idcRackSlot.idcRack.idcRoom.pduStandard].text,
      render: (_, record) => IdcRoomPduStandardFilter[record.idcRackSlot.idcRack.idcRoom.pduStandard].text
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcRoomPowerMode"}),
      dataIndex: "idcRoomPowerMode",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => IdcRoomPowerModeFilter[record.idcRackSlot.idcRack.idcRoom.powerMode].text,
      render: (_, record) => IdcRoomPowerModeFilter[record.idcRackSlot.idcRack.idcRoom.powerMode].text
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcRoomRackSize"}),
      dataIndex: "idcRoomRackSize",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) =>IdcRoomRackSizeFilter[record.idcRackSlot.idcRack.idcRoom.rackSize].text,
      render: (_, record) => IdcRoomRackSizeFilter[record.idcRackSlot.idcRack.idcRoom.rackSize].text
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcRoomBearerType"}),
      dataIndex: "idcRoomBearerType",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => IdcRoomBearerTypeFilter[record.idcRackSlot.idcRack.idcRoom.bearerType].text,
      render: (_, record) => IdcRoomBearerTypeFilter[record.idcRackSlot.idcRack.idcRoom.bearerType].text
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcRooBearWeight"}),
      dataIndex: "idcRooBearWeight",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => IdcRoomBearWeightFilter[record.idcRackSlot.idcRack.idcRoom.bearWeight].text,
      render: (_, record) => IdcRoomBearWeightFilter[record.idcRackSlot.idcRack.idcRoom.bearWeight].text
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcRoomStatus"}),
      dataIndex: "idcRoomStatus",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => IdcAzStatusFilter[record.idcRackSlot.idcRack.idcRoom.status].text,
      render: (_, record) => IdcAzStatusFilter[record.idcRackSlot.idcRack.idcRoom.status].text
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcName"}),
      dataIndex: "idcName",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) =>  record.idcRackSlot.idcRack.idcRoom.idc.name,
      render: (_, record) => record.idcRackSlot.idcRack.idcRoom.idc.name
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcCnName"}),
      dataIndex: "idcCnName",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.idcRoom.idc.cnName,
      render: (_, record) => record.idcRackSlot.idcRack.idcRoom.idc.cnName
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.physicsName"}),
      dataIndex: "physicsName",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.idcRoom.idc.physicsAz.name,
      render: (_, record) => <Tag color="#2db7f5">{record.idcRackSlot.idcRack.idcRoom.idc.physicsAz.name}</Tag>
    },
    {
      title: intl.formatMessage({id: "idc.idc.column.virtualName"}),
      dataIndex: "virtualName",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.idcRoom.idc.virtualAz.name,
      render: (_, record) => <Tag color="#2db7f5">{record.idcRackSlot.idcRack.idcRoom.idc.virtualAz.name}</Tag>
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcStatus"}),
      dataIndex: "idcStatus",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) =>IdcAzStatusFilter[record.idcRackSlot.idcRack.idcRoom.idc.status].text,
      render: (_, record) => IdcAzStatusFilter[record.idcRackSlot.idcRack.idcRoom.idc.status].text
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcAddress"}),
      dataIndex: "idcAddress",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.idcRoom.idc.address,
      render: (_, record) => record.idcRackSlot.idcRack.idcRoom.idc.address
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcRegion"}),
      dataIndex: "idcRegion",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) =>record.idcRackSlot.idcRack.idcRoom.idc.region,
      render: (_, record) => record.idcRackSlot.idcRack.idcRoom.idc.region
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcCity"}),
      dataIndex: "idcCity",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.idcRoom.idc.city,
      render: (_, record) => record.idcRackSlot.idcRack.idcRoom.idc.city
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcCabinetNum"}),
      dataIndex: "idcCabinetNum",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) => record.idcRackSlot.idcRack.idcRoom.idc.cabinetNum,
      render: (_, record) => record.idcRackSlot.idcRack.idcRoom.idc.cabinetNum
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcPhone"}),
      dataIndex: "idcPhone",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) =>  record.idcRackSlot.idcRack.idcRoom.idc.idcPhone,
      render: (_, record) => record.idcRackSlot.idcRack.idcRoom.idc.idcPhone
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.idcMail"}),
      dataIndex: "idcMail",
      width: 160,
      hideInSearch: true,
      choices: (value: number, record) =>  record.idcRackSlot.idcRack.idcRoom.idc.idcMail,
      render: (_, record) => record.idcRackSlot.idcRack.idcRoom.idc.idcMail
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.arrivalTime"}),
      dataIndex: "arrivalTime",
      width: 160,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.overdueTime"}),
      dataIndex: "overdueTime",
      width: 160,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'assets.hosts.column.isDeleted'}),
      dataIndex: "isDeleted",
      valueType: 'select',
      valueEnum: nodeIsDeletedFilter,
      hideInTable: true,
      choices: (value: number) => nodeIsDeletedFilter[value].text
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.comment"}),
      dataIndex: "comment",
      hideInSearch: true,
      width: 160,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.creator"}),
      dataIndex: "creator",
      width: 160,
      hideInSearch: true
    }, {
      title: intl.formatMessage({id: "assets.hosts.column.createTime"}),
      dataIndex: "createTime",
      valueType: 'dateTime',
      hideInSearch: true,
      width: 160,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: "assets.hosts.column.updateTime"}),
      dataIndex: "updateTime",
      valueType: 'dateTime',
      hideInSearch: true,
      width: 160,
      hideInSearch: true
    },
    {
      title: intl.formatMessage({id: 'pages.permissions.menu.list.role.grant.group.columns.operate'}),
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record) => [
        checkUserHavePageReadPermissions(assetsHostPermissionsMenuKeys, access, userMenuPermissions) &&
          <span
            style={clickExtender}
            key="look"
            onClick={()=> history.push(`/assets/hosts/server-tree/${params.treeId}/machine/${record.id}/detail`)}
          >{intl.formatMessage({id: 'assets.node.table.option.detail'})}</span>,
        checkUserUpdatePermissions(assetsHostPermissionsMenuKeys, userMenuPermissions) && record.isDeleted === 0 &&
        <span
          style={clickExtender}
          key="edit"
          onClick={()=>{history.push(`/assets/hosts/server-tree/${params.treeId}/machine/${record.id}/update`)}}
        >{intl.formatMessage({id: 'assets.hosts.column.option.edit'})}</span>,
        (checkUserDeletePermissions(assetsHostPermissionsMenuKeys, userMenuPermissions) || checkUserUpdatePermissions(assetsHostPermissionsMenuKeys, userMenuPermissions)) &&  record.isDeleted === 0 &&
          <TableDropdown
            children={
              <span
                style={clickExtender}
                key="look">
                {intl.formatMessage({id: 'assets.hosts.column.option.more'})}
                </span>
            }
            key="actionGroup"
            onSelect={(key) => handleColumnOptionChange(key, record)}
            menus={[
              checkUserUpdatePermissions(assetsHostPermissionsMenuKeys, userMenuPermissions) && { key: 'migrate', icon: <NodeIndexOutlined/> , name: intl.formatMessage({id: "assets.hosts.column.option.migrate"}) },
              checkUserUpdatePermissions(assetsHostPermissionsMenuKeys, userMenuPermissions) && { key: 'repair', icon: <BugOutlined />,  name: intl.formatMessage({id: "assets.hosts.column.option.repair"})},
              checkUserDeletePermissions(assetsHostPermissionsMenuKeys, userMenuPermissions) && { key: 'delete', icon: <DeleteOutlined />, name: intl.formatMessage({id: "assets.hosts.column.option.delete"}) },
            ]}
          />
      ]
    }
  ]

  const handleColumnOptionChange = (key: string, current: ServerResponse.ServerInfo) => {
    setCurrentRow(current)
    switch (key) {
      case "migrate":
        handleServerTreeMigrate([current])
        break
      case "repair":
        break
      case "delete":
        if (current.status !== 9) {
          message.warning(intl.formatMessage({id: 'assets.hosts.delete.status.message'}))
          return
        } else {
          setUpdateConfirmOpen(true)
        }
        break
    }
  }

  useEffect(() => {
    setTreeId(currentTree.id ? currentTree.id : params.treeId)
    queryServiceTreeList().then(result=>{
      if (result.success) {
        const response = buildTree(result.data.list, 0)
        setProductLines(response)
      }
    })
  }, [])

  useEffect(() => {
    if (!currentTree.id) {
      return
    }
    setTreeId(currentTree.id)
  }, [currentTree])

  useEffect(() => {
    actionRef.current?.reload()
  }, [params])

  const uploadProps: UploadProps = {
    disabled: uploadFileDisable,
    name: 'file',
    multiple: false,
    fileList: uploadFileList,
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 <= 10
      if (!isLt10M) {
        message.error(intl.formatMessage({id: 'assets.node.toolBar.table.import.size'}))
        return
      }
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel") {
        setUploadFileList([file])
        //setUploadFileList([...uploadFileList, file])
      } else {
        message.error(intl.formatMessage({id: 'assets.node.toolBar.table.import.type'}))
      }
    },
    onRemove: (file) => {
      setUploadFileList([])
      return
      const index = uploadFileList.indexOf(file);
      const newFileList = uploadFileList.slice();
      newFileList.splice(index, 1);
      setUploadFileList(newFileList);
    },
  };

  const getSelectRowKeys = () => {
    return selectRowValues.map((item: NodeResponse.NodeInfo) => {
      return item.id
    })
  }

  const handleMultiUploadOk = () => {
    if (uploadFileList.length === 0) {
      message.warning(intl.formatMessage({id: 'assets.node.toolBar.table.import.empty'}))
      return
    }
    setUploadFileDisbled(true)
    setMultiUploadConfirm(true)
    const formData = new FormData();
    uploadFileList.forEach((file) => {
      formData.append('file', file);
    })

    multiUploadServer(params.treeId, formData).then((res=>{
      if (res.success) {
        const msg = (<div>
          <p>{intl.formatMessage({id: 'assets.node.toolBar.table.import.response.success'})}: {res.data.list.success}, {intl.formatMessage({id: 'assets.node.toolBar.table.import.response.error'})}: {res.data.list.error}</p>
        </div>)
        const cfg = {
          type: 'success',
          content: msg,
          duration: 3,
        }

        if (res.data.list.error > 0) {
          cfg.type = "warning"
          messageApi.open(cfg)
          setUploadFileDisbled(false)
          setMultiUploadConfirm(false)
        } else {
          messageApi.open(cfg)
          actionRef.current?.reload()
          handleMultiUploadCancel()
        }
      }
    }))

  }

  const handleMultiUploadCancel = () => {
      setUploadFileList([])
      setMultiUploadOpen(false)
      setUploadFileDisbled(false)
      setMultiUploadConfirm(false)
    }

  const eventPollingChange = (e) => {
      if (e.target.checked) {
        setPolling(2000);
        return
      }
      setPolling(0);
    }

  const fetch = async (queryParams: object, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
    if (Object.keys(filteredInfo).length === 0) {
      filter = {}
    }
    fetchParams.requestParams = [params.treeId]
    const result = await fetchUtil(fetchParams, queryParams, sort, filter)
    if (result.success) {
      setData(result.data)
    }
    return result
  }

  const multiDeleteHandle = (selectRows: NodeResponse.NodeInfo[]) => {
    return confirm({
      title: intl.formatMessage({id: 'assets.node.table.alert.option.multiDelete.title'}),
      icon: <ExclamationCircleFilled />,
      content: <div><Flex wrap="wrap" gap="small">
        {
          selectRows.map((item, index)=>{
            return (<span key={index}>{item.hostname}</span>)
          })
        }
      </Flex></div>,
      onOk() {
        const data = {
          ids: selectRows.map((item)=>item.id)
        }
        return multiDeleteServer(data).then((res=>{
          message.success(intl.formatMessage({id: 'assets.node.table.option.delete.success'}))
          actionRef.current?.reload()
          setSelectRowValues([])
        })).catch(err=>{
          message.error(intl.formatMessage({id: 'assets.node.table.option.delete.error'}))
          console.log(err)
        })
      },
      onCancel() {},
    });
  };

  const exportExcel = (data: NodeResponse.NodeInfo[]) => {
      if (data.length === 0) {
        return
      }
      const option = {};
      option.fileName = `${intl.formatMessage({id: 'assets.hosts.export.fileName'})}${moment().format("YYYYMMDDHHmm")}`;
      option.datas = [
        {
          sheetData: data.map(item => {
            const result = {};
            columns.forEach(c => {
              console.log()
              result[c.dataIndex] = c.hasOwnProperty("choices") && c.choices(item[c.dataIndex], item) || item[c.dataIndex];
            });
            return result;
          }),
          sheetName: intl.formatMessage({id: 'assets.hosts.export.sheetName'}),
          sheetFilter: columns.map(item => item.dataIndex),
          sheetHeader: columns.map(item => item.valueType !== "option" && item.title || ""),
          columnWidths: columns.map(() => 10),
        }
      ];

      const result = []

      for (let elem of option.datas[0].sheetData) {
        result.push(elem)
      }
      option.datas[0].sheetData = result
      const toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();
    };

  const handleChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearSort = () => {
    setSortedInfo({})
  }

  const clearAll = () => {
    setMultiSearchParams({})
    clearFilters()
    clearSort()
  }

  const handleServerTreeMigrate = (serverIds: number[]) => {
    const option = serverIds.map(item =>{
      return item.id
    })

    setMigrateRow({
      serverIds: option,
      srcTreeId: parseInt(params.treeId),
      targetIds: []
    })
    proModalUpdateRef.current?.proModalHandleOpen?.(true)
  }
  const handleOnUpdateCancel = () => {
    actionRef.current?.reload()
    setSelectRowValues([])
    setMigrateRow({});
  }

  const handleValidTreeMigrateForm = (value: any): boolean => {
    const currentTreeId = parseInt(params.treeId)
    if (value.targetIds.indexOf(currentTreeId) !== -1) {
      message.warning(intl.formatMessage({id: 'assets.hosts.migrate.form.valid.repeat.message'}))
      return false
    }
    if (value.srcTreeId !== parseInt(params.treeId)) {
      return false
    }
    const serverList: ServerResponse.ServerInfo[] = []
    value.serverIds.forEach(serverId => {
      data.map(server=>{
        if (server.id === serverId) {
          serverList.push(server)
        }
      })
    })

    let treeErrors: number = 0

    serverList.forEach(server => {
      let treeError = 0
      server.productLines.forEach(product => {
        if (product.id === currentTreeId) {
          treeError += 1
        }
      })
      if (treeError === 0) {
        treeErrors += 1
      }
    })

    if (treeErrors > 0 ) {
      message.warning(intl.formatMessage({id: 'assets.hosts.migrate.form.valid.level.message'}))
      return false
    }
    return true
  }


  const handleDeleteCancel = () => {
    setCurrentRow({})
    setUpdateConfirmOpen(false)
  }

  const handleDeleteOk = async () => {
    setDeleteModalLoading(true)
    const result = await deleteServer(currentRow.id)
    if (result.success) {
      actionRef.current?.reload()
      setDeleteModalLoading(false)
      handleDeleteCancel()
    }
  }

  const ProModalUpdateParams: ProModal.Params = {
    title: 'assets.hosts.table.alert.migrate',
    handleOnCancel :handleOnUpdateCancel,
    width: "510px",
    // @ts-ignore
    request: ServerTreeMigrate,
    initialValues: migrateRow,
    formItems: ServerTreeMigrateForm(productLines, migrateRow, data, treeRawList),
    params: [],
    valueIsValid: handleValidTreeMigrateForm,
    successMessage: 'component.form.edit.success',
    errorMessage: 'component.form.edit.fail'
  }
  const multiSearchOnCancel = () => {
    setMultiSearchLoading(false)
    setMultiSearchVisable(false)
  }

  const multiSearchOnOk = async () => {
    if (multiSearchContent.length === 0 ) {
      return
    }
    setMultiSearchLoading(true)
    const params = {
      [multiSearchFieldType]: multiSearchContent.split("\n").join(",").replace(/\s/g, '')
    }
    setMultiSearchParams(params)
    actionRef.current?.reload()
    setMultiSearchLoading(false)
    setMultiSearchVisable(false)
    setMultiSearchContent("")
  }

  const multiSearchFieldTypeChange = (e: RadioChangeEvent) => {
    setMultiSearchFieldType(e.target.value)
  }


    return (
      <ProCard
        title={intl.formatMessage({id: 'assets.hosts.page.title'})}>
        <Access
          accessible={checkUserHavePageReadPermissions(assetsHostPermissionsMenuKeys, access, userMenuPermissions)}
          fallback={<ForbiddenPage/>}>
            {loading ? <Loading/> :
              <ProTable
                onReset={clearAll}
                onSubmit={()=>setMultiSearchParams({})}
                onChange={handleChange}
                rowKey={'id'}
                cardBordered
                columnsState={{
                  value: columnsStateMap,
                  onChange: setColumnsStateMap,
                }}
                bordered
                defaultSize="small"
                form={{
                  syncToInitialValues: false,
                  syncToUrl: false
                }}
                rowSelection={{
                  selections: [],
                  defaultSelectedRowKeys: [],
                  selectedRowKeys: getSelectRowKeys(),
                  // onChange: (_,selectedRows) =>setSelectRowValues(selectedRows),
                  onSelect: (record, selected) => setSelectRowValues(selected ? Array.from(new Set([...selectRowValues, record])) : selectRowValues.filter(o => o !== record)),
                  onSelectAll: (selected, selectedRows, changeRows) => setSelectRowValues(selected ? Array.from(new Set([...selectedRows, ...selectedRows.filter(o => o).map(o => o)])) : selectRowValues.filter(o => !changeRows.find(row => row === o)))
                }}
                tableAlertRender={({
                                     selectedRowKeys,
                                     selectedRows,
                                     onCleanSelected,
                                   }) => {
                  return (
                    <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{marginInlineStart: 8}} onClick={() =>{
               setSelectRowValues([])
              }}>
                取消选择
              </a>
            </span>
                    </Space>
                  );
                }}
                tableAlertOptionRender={() => {
                  return (
                    <Space size={16}>
                      {checkUserCreatePermissions(assetsHostPermissionsMenuKeys, userMenuPermissions) &&
                        <a target="_blank" href="/#" rel="noreferrer" onClick={(e) => {
                          e.preventDefault()
                          handleServerTreeMigrate(selectRowValues)
                        }}>{intl.formatMessage({id: 'assets.hosts.table.alert.migrate'})}</a>
                      }
                      {checkUserDeletePermissions(assetsHostPermissionsMenuKeys, userMenuPermissions) &&
                      <a target="_blank" href="/#" rel="noreferrer" onClick={(e) => {
                        e.preventDefault()
                        multiDeleteHandle(selectRowValues)
                      }}>{intl.formatMessage({id: 'assets.node.table.alert.option.multiDelete'})}</a>
                      }
                      <a target="_blank" href="/#" rel="noreferrer" onClick={(e) => {
                        e.preventDefault()
                        exportExcel(selectRowValues)
                      }}>{intl.formatMessage({id: 'assets.node.table.alert.option.exportData'})}</a>

                    </Space>
                  );
                }}
                actionRef={actionRef}
                columns={columns}
                pagination={{
                  showSizeChanger: true,
                }}
                params={Object.keys(multiSearchParams).length > 0 ? {...multiSearchParams} : {}}
                request={fetch}
                scroll={{x: 'max-content'}}
                polling={polling}
                toolBarRender={() => [
                  <Button onClick={()=>setMultiSearchVisable(true)} type='primary'>{intl.formatMessage({id: 'menu.table.multiSearch'})}</Button>,
                  checkUserCreatePermissions(assetsHostPermissionsMenuKeys, userMenuPermissions) &&
                  <Button key="in" onClick={() => {
                    setMultiUploadOpen(true)
                  }}>{intl.formatMessage({id: 'assets.node.toolBar.import'})} <UploadOutlined/></Button>,
                  checkUserCreatePermissions(assetsHostPermissionsMenuKeys, userMenuPermissions) &&
                  <Button key="export" onClick={() => {
                    exportExcel(data)
                  }}>{intl.formatMessage({id: 'assets.node.toolBar.export'})} <DownOutlined/></Button>,
                  checkUserCreatePermissions(assetsHostPermissionsMenuKeys, userMenuPermissions) &&
                  <Button type='primary' onClick={() => {
                   history.push(`/assets/hosts/server-tree/${params.treeId}/machine/create`)
                  }}>{intl.formatMessage({id: 'assets.node.toolBar.create'})}</Button>,
                  <Checkbox
                    onChange={eventPollingChange}>{intl.formatMessage({id: 'assets.node.toolBar.table.start.polling'})}</Checkbox>
                ]}
              />
            }
            <Modal
              maskClosable={false}
              title={intl.formatMessage({id: 'assets.node.toolBar.table.import'})}
              open={multiUploadOpen}
              onOk={handleMultiUploadOk}
              confirmLoading={multiUploadConfirm}
              onCancel={handleMultiUploadCancel}
              destroyOnClose={true}
            >
              <>
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                  </p>
                  <p
                    className="ant-upload-text">{intl.formatMessage({id: 'assets.node.toolBar.table.import.title'})}</p>
                  <p className="ant-upload-hint">
                    {intl.formatMessage({id: 'assets.node.toolBar.table.import.description'})}
                  </p>
                </Dragger>
                <div style={{height: 10, marginTop: 5, marginBottom: 20}}>
                  <a style={{float: 'right'}}
                     href="/files/spider-host-import-example.xlsx">{intl.formatMessage({id: 'assets.node.toolBar.table.import.templateName'})}</a>
                </div>
              </>
            </Modal>
            {contextHolder}
          <DesignProModalForm
            {...ProModalUpdateParams}
            ref={proModalUpdateRef}
          />

          <Modal
            title={intl.formatMessage({id: "assets.hosts.delete.title"})}
            open={updateConfirmOpen}
            onOk={handleDeleteOk}
            onCancel={handleDeleteCancel}
            width={600}
            confirmLoading={deleteModalLoading}
          >
            <div>
            <Alert
              style={{marginBottom: 12}}
              banner
              message={
                <Marquee pauseOnHover gradient={false}>
                  {intl.formatMessage({id: 'assets.hosts.delete.alert'})}
                </Marquee>
              }
            />
              <span style={{color: "red"}}>( {currentRow?.hostname} )</span>&nbsp;
              <span>{intl.formatMessage({id: "assets.hosts.delete.content"})}</span>
            </div>
          </Modal>
          <Modal
            maskClosable={false}
            title={intl.formatMessage({id: 'menu.table.multiSearch'})}
            open={multiSearchVisable}
            confirmLoading={multiSearchLoading}
            destroyOnClose={true}
            onCancel={multiSearchOnCancel}
            onOk={multiSearchOnOk}
          >
            <Flex gap="middle" vertical>
              <Radio.Group onChange={multiSearchFieldTypeChange} defaultValue={multiSearchFieldType}>
                  <Radio.Button value="multiSearchFieldSn">{intl.formatMessage({id: "assets.hosts.column.sn"})}</Radio.Button>
                <Radio.Button value="multiSearchFieldHostname">{intl.formatMessage({id: "assets.hosts.column.hostname"})}</Radio.Button>
                <Radio.Button value="multiSearchFieldPubIp">{intl.formatMessage({id: "assets.hosts.column.pubNetIp"})}</Radio.Button>
                <Radio.Button value="multiSearchFieldPrivIp">{intl.formatMessage({id: "assets.hosts.column.privNetIp"})}</Radio.Button>
                <Radio.Button value="multiSearchFieldMgmtIp">{intl.formatMessage({id: "assets.hosts.column.mgmtPortIp"})}</Radio.Button>
              </Radio.Group>
              <Input.TextArea
                onChange={(e)=> setMultiSearchContent(e.target.value)}
                showCount
                maxLength={10000}
                placeholder={intl.formatMessage({id: 'menu.table.multiSearch.content.placeholder'})}
                rows={10}
                style={{marginBottom: 12}}
              />
            </Flex>
          </Modal>
        </Access>
      </ProCard>
    )
  }

