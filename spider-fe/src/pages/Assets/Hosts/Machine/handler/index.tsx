import "../detail.less"
import {
  PageContainer, ProCard, ProForm,
  ProFormText, ProFormSelect, ProFormRadio, ProFormTreeSelect, ProFormTextArea,
  ProFormDateTimePicker, ProFormGroup
} from '@ant-design/pro-components'
import {useIntl, Access, useParams, history} from "umi";
import ForbiddenPage from "@/pages/403";
import {
  checkUserUpdatePermissions,
  checkUserCreatePermissions,
  assetsHostPermissionsMenuKeys,
} from '@/access'
import React, {useEffect, useState} from "react";
import {useModel} from "@@/exports";
import {BackTitle} from '@/components/CustonizeTitle'
import {ComponentTitle} from "@/components/CustonizeTitle";
import {FormInstance} from "antd/es/form";
import columnConvert from "@/util/ProTableColumnConvert";
import {nodeOperatorFilter, nodeStatusFilter, optionRender} from "@/util/dataConvert";
import {queryServiceTreeList} from "@/services/Assets/ServiceTree/api";
import {queryTags} from '@/services/Assets/Server/api'
import {buildTree} from "@/util/Tree/tree";
import {Row, Col, Space, Button, message} from 'antd'
import {queryNodeList} from "@/services/Assets/Node/api";
import {SelectRemoteSearch} from '@/components/RemoteSearchSelect'
import {queryIdcFactoryList, queryIdcProviderList, queryIdcRackSlotList, queryIdcSuitList, queryFullNameIdcRackSlot} from "@/services/Idc/idc";
import SelectRemoteSearchAutoCreate from '@/components/SelectRemoteSearchAutoCreate'

const formItemLayout = {
  //labelCol: { span: 4 }
  labelCol: { span: 5 }
}

export default (props: ServerForm.Params) => {
  const intl = useIntl()
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const params = useParams()
  const getCheckPermissionsFunc = () => {
    switch (props.handleType) {
      case "create":
        return checkUserCreatePermissions;
      case "update":
        return checkUserUpdatePermissions;
    }
  }
  const checkPermissions = getCheckPermissionsFunc()
  const titleParams = {
    title: intl.formatMessage({id: props.title}),
    uri: `/assets/hosts/server-tree/${params.treeId}/machine`
  }
  const formRef = React.createRef<FormInstance>();
  const [productLines, setProductLines] = useState();
  const [currentTree, setCurrentTree] = useState({});
  const [searchNodeName, setNodeName] = useState("")
  const [searchSuitName, setSuitName] = useState("")
  const [searchProviderName, setProviderName] = useState("")
  const [searchFactoryName, setFactoryName] = useState("")
  const [searchRackSlotName, setRackSlotName] = useState("")
  const [loading, setLoading] = useState(false)

  const autoCreateSelectParams: SelectRemoteSearchAutoCreateRequest.Params = {
    request: queryTags,
    option: {
      label: "name",
      value: "name"
    },
    label: "assets.hosts.column.tag",
    name: "tags",
    width: "lg",
    buttonTitle: "assets.hosts.form.add",
    params: {}
  }

  const ValidTreeHandler = (values: ServerRequest.CreateServer) => {
    const currentTreeId = parseInt(params.treeId)
    const filterTreeList = values.productLines.filter(id => id === currentTreeId)
    if (filterTreeList.length === 0 ) {
      message.error(intl.formatMessage({id: 'assets.hosts.valid.tree'}))
      return false
    }
    return true
  }

  const formOnFinish = async (values) => {
    setLoading(true)
    if (!ValidTreeHandler(values)) {
      message.error(intl.formatMessage({id: 'assets.hosts.form.validError'}))
      setLoading(false)
      return
    }
    let result: any
    let runSuccessMessage: string

    switch (props.handleType) {
      case "create":
        result = await props.request(values)
        runSuccessMessage = 'assets.hosts.form.create.success'
        break;
      case "update":
        result = await props.request(props.initialValues?.id, values)
        runSuccessMessage = "assets.hosts.form.update.success"
        break;
    }

    if (result.success) {
      message.success(intl.formatMessage({id: runSuccessMessage}))
      formRef.current?.resetFields()
      setLoading(false)
    }else {
      message.error(result.errorMessage)
      setLoading(false)
    }
  }

  useEffect(() => {
    queryServiceTreeList().then(result=>{
      if (result.success) {
        formRef.current?.setFieldsValue({
          "productLines": [parseInt(params.treeId), ...(Array.isArray(props.initialValues?.productLines) ? props.initialValues.productLines : [])]
        })
        const t = result.data.list.filter(item => parseInt(params.treeId) === item.id)
        setCurrentTree(t[0])
        const response = buildTree(result.data.list, 0)
        setProductLines(response)
      }
    })
  }, [])
  return (
    <Access
      accessible={checkPermissions(assetsHostPermissionsMenuKeys, userMenuPermissions)}
      fallback={<ForbiddenPage/>}>
        <PageContainer
          breadcrumb={false}
          header={{
            ghost: true,
            title: <BackTitle {...titleParams} />,
            style: {
              borderRadius: 6,
              padding: 12,
              backgroundColor: "#fff"
            }
        }}
          content={
            <ProForm
            //  {...formItemLayout}
              initialValues={props.initialValues}
              formRef={formRef}
              onFinish={formOnFinish}
             // style={{maxWidth: 550}}
              submitter={{
                render: (props, doms) => {
                  return (
                    <Row>
                      <Col span={24} >
                        <Space style={{marginBottom: 14}}>
                          <Button
                            type={'primary'}
                            key="submit"
                            loading={loading}
                            style={{marginLeft: 14}}
                            onClick={() => props.form?.submit?.()}
                          >
                            {intl.formatMessage({id: 'assets.hosts.form.submit'})}
                          </Button>
                          <Button
                            loading={loading}
                            key="rest"
                            onClick={() => history.push(titleParams.uri) }
                          >
                            {intl.formatMessage({id: 'assets.hosts.form.cancel'})}
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  );
                },
              }}
             // layout={'horizontal'}
            >
              <ProCard style={{marginLeft: -12, marginTop: -36}} title={<ComponentTitle title={intl.formatMessage({id: 'pages.detail.basic.title'})} />}>
                <ProFormGroup>
                <ProFormText
                   name="hostname"
                   width="lg"
                   placeholder={intl.formatMessage({id: "assets.hosts.column.hostname"})}
                   rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.hostname"}) }]}
                   label={intl.formatMessage({id: "assets.hosts.column.hostname"})}/>

                  <ProFormText
                    width="lg"
                    name="sn"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.sn"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.sn"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.sn"})}/>
                </ProFormGroup>
                <ProFormGroup>
                  <ProFormSelect
                    width="lg"
                    name="nodeId"
                    placeholder={intl.formatMessage({id: "assets.node.table.column.name"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.node.table.column.name"}) }]}
                    label={intl.formatMessage({id: "assets.node.table.column.name"})}
                    request={async () => {
                      const params = {}
                      if (searchNodeName !== "") {
                        params["name"] = searchNodeName
                      }
                      const result = await SelectRemoteSearch(params, queryNodeList,"name", "id")
                      if (props.initialValues && props.initialValues.nodeId > 0) {
                        let f = result.filter(item => item.id === props.initialValues.nodeId)
                        if (f.length === 0) {
                          return await SelectRemoteSearch( {id: props.initialValues.nodeId}, queryNodeList,"name", "id")
                        }
                      }
                      return result
                    }}
                    fieldProps={{
                      allowClear: true,
                      showSearch: true,
                      onSearch: (value: string) => {
                        setNodeName(value)
                      }
                    }}
                  />

                <ProFormSelect
                  name="status"
                  width="lg"
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.status"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.column.status"})}
                  valueEnum={nodeStatusFilter}
                  convertValue={(value:any) => {
                    if (typeof value === 'number') {
                      return `${value}`
                    }
                  }}
                  transform={(value: string) => {
                    return {
                      status: parseInt(value)
                    }
                  }
                  }
                />
                </ProFormGroup>
                <ProFormGroup>
                <ProFormTreeSelect
                  name="productLines"
                  width="lg"
                  placeholder={intl.formatMessage({id: "assets.node.table.column.productLines"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.node.table.column.productLines"}) }]}
                  label={intl.formatMessage({id: "assets.node.table.column.productLines"})}
                  convertValue={ (value: any) => {if (!value) {return}return value.map((x: any) => x.id ? x.id : x)}}
                  transform={(value: any) => {return {productLines: value.map((x: any) => x.id ? x.id : x)}}}
                  fieldProps={{
                    options: productLines,
                    fieldNames: {
                      children: 'children',
                      label: 'name',
                      value: 'id',
                    },
                    showSearch: true,
                    filterTreeNode: true,
                    multiple: true,
                    treeNodeFilterProp: 'id',
                    treeNodeLabelProp: 'fullNamePath'
                  }}
                />
                  <SelectRemoteSearchAutoCreate {...autoCreateSelectParams} />
                </ProFormGroup>
                <ProFormGroup>
                  <ProFormText
                    name="powerInfo"
                    width="lg"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.powerInfo"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.powerInfo"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.powerInfo"})}/>
                  <ProFormText
                    name="powerCost"
                    width="lg"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.powerCost"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.powerCost"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.powerCost"})}/>
                </ProFormGroup>

                  <ProFormRadio.Group
                    name="role"
                    width="lg"
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.role"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.role"})}
                    options={optionRender(columnConvert["assets.machine.role"])}
                    convertValue={(value:any) => {
                      if (typeof value === 'number') {return `${value}`}}}
                    transform={(value: string) => {return {role: parseInt(value)}}}
                  />
                <ProFormRadio.Group
                  name="operator"
                  width="lg"
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.operator"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.column.operator"})}
                  valueEnum={nodeOperatorFilter}
                  convertValue={(value:any) => {
                    if (typeof value === 'number') {return `${value}`}}}
                  transform={(value: string) => {return {operator: parseInt(value)}}}
                />
                  <ProFormRadio.Group
                    name="type"
                    width="md"
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.type"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.type"})}
                    options={optionRender(columnConvert["assets.machine.type"])}
                    convertValue={(value:any) => {
                      if (typeof value === 'number') {
                        return `${value}`
                      }
                    }}
                    transform={(value: string) => {
                      return {
                        type: parseInt(value)
                      }
                    }
                    }
                  />
                <ProFormRadio.Group
                  name="appEnv"
                  width="md"
                  valueEnum={columnConvert["assets.machine.appEnv"]}
                  placeholder={intl.formatMessage({id: "assets.hosts.column.appEnv"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.appEnv"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.column.appEnv"})}/>
                <ProFormTextArea
                  name="appEnvDesc"
                  width="xl"
                  placeholder={intl.formatMessage({id: "assets.hosts.column.appEnvDesc"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.appEnvDesc"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.column.appEnvDesc"})}/>
                <ProFormRadio.Group
                  name="belongTo"
                  valueEnum={columnConvert["assets.machine.belongTo"]}
                  placeholder={intl.formatMessage({id: "assets.hosts.column.belongTo"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.belongTo"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.column.belongTo"})}/>
                <ProFormTextArea
                  name="belongToDesc"
                  width="xl"
                  placeholder={intl.formatMessage({id: "assets.hosts.column.belongToDesc"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.belongToDesc"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.column.belongToDesc"})}/>
                <ProFormTextArea
                  name="comment"
                  width="xl"
                  placeholder={intl.formatMessage({id: "assets.hosts.column.comment"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.comment"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.column.comment"})}/>
              </ProCard>
              <ProCard style={{marginLeft: -12, marginTop: -36}} title={<ComponentTitle title={intl.formatMessage({id: 'assets.hosts.form.system.title'})} />}>
                <ProFormGroup>
                <ProFormText
                  name="systemType"
                  width="sm"
                  placeholder={intl.formatMessage({id: "assets.hosts.form.system.version"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.form.system.version"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.form.system.version"})}/>
                <ProFormText
                  name="systemVersion"
                  width="sm"
                  placeholder={intl.formatMessage({id: "assets.hosts.form.system.kernel"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.form.system.kernel"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.form.system.kernel"})}/>
                <ProFormText
                  name="systemArch"
                  width="sm"
                  placeholder={intl.formatMessage({id: "assets.hosts.form.system.platform"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.form.system.platform"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.form.system.platform"})}/>
                </ProFormGroup>
              </ProCard>
              <ProCard style={{marginLeft: -12, marginTop: -36}} title={<ComponentTitle title={intl.formatMessage({id: 'assets.hosts.form.network.title'})} />}>
                <ProForm.Group>
                  <ProFormText
                    width="sm"
                    name="pubNetIp"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.pubNetIp"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.pubNetIp"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.pubNetIp"})}/>
                  <ProFormText
                    width="sm"
                    name="pubNetMask"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.pubNetMask"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.pubNetMask"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.pubNetMask"})}/>
                  <ProFormText
                    width="sm"
                    name="pubNetGw"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.pubNetGw"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.pubNetGw"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.pubNetGw"})}/>
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormText
                    width="sm"
                    name="privNetIp"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.privNetIp"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.privNetIp"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.privNetIp"})}/>
                  <ProFormText
                    width="sm"
                    name="privNetMask"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.privNetMask"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.privNetMask"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.privNetMask"})}/>
                  <ProFormText
                    width="sm"
                    name="privNetGw"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.privNetGw"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.privNetGw"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.privNetGw"})}/>
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormText
                    width="sm"
                    name="mgmtPortIp"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.mgmtPortIp"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.mgmtPortIp"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.mgmtPortIp"})}/>
                  <ProFormText
                    width="sm"
                    name="mgmtPortMask"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.mgmtPortMask"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.mgmtPortMask"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.mgmtPortMask"})}/>
                  <ProFormText
                    width="sm"
                    name="mgmtPortGw"
                    placeholder={intl.formatMessage({id: "assets.hosts.column.mgmtPortGw"})}
                    rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.mgmtPortGw"}) }]}
                    label={intl.formatMessage({id: "assets.hosts.column.mgmtPortGw"})}/>
                </ProForm.Group>
              </ProCard>
              <ProCard style={{marginLeft: -12, marginTop: -36}} title={<ComponentTitle title={intl.formatMessage({id: 'assets.hosts.form.idc.title'})} />}>
                <ProFormGroup>
                <ProFormSelect
                  name="suitId"
                  width="sm"
                  placeholder={intl.formatMessage({id: "idc.suit.column.name"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "idc.suit.column.name"}) }]}
                  label={intl.formatMessage({id: "idc.suit.column.name"})}
                  request={async () => {
                    const params = {}
                    if (searchSuitName !== "") {
                      params["name"] = searchSuitName
                    }
                    const result = await SelectRemoteSearch(params, queryIdcSuitList,"name", "id")
                    if (props.initialValues && props.initialValues.suitId > 0) {
                      let f = result.filter(item => item.id === props.initialValues.nodeId)
                      if (f.length === 0) {
                        return await SelectRemoteSearch( {id: props.initialValues.suitId}, queryIdcSuitList,"name", "id")
                      }
                    }
                    return result
                  }}
                  fieldProps={{
                    allowClear: true,
                    showSearch: true,
                    onSearch: (value: string) => {
                      setSuitName(value)
                    }
                  }}
                />
                <ProFormSelect
                  width="sm"
                  name="providerId"
                  placeholder={intl.formatMessage({id: "assets.hosts.form.provider.name"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.form.provider.name"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.form.provider.name"})}
                  request={async () => {
                    const params = {}
                    if (searchProviderName !== "") {
                      params["name"] = searchProviderName
                    }
                    const result = await SelectRemoteSearch(params, queryIdcProviderList,"name", "id")
                    if (props.initialValues && props.initialValues.providerId > 0) {
                      let f = result.filter(item => item.id === props.initialValues.providerId)
                      if (f.length === 0) {
                        return await SelectRemoteSearch( {id: props.initialValues.providerId}, queryIdcProviderList,"name", "id")
                      }
                    }
                    return result
                  }}
                  fieldProps={{
                    allowClear: true,
                    showSearch: true,
                    onSearch: (value: string) => {
                      setProviderName(value)
                    }
                  }}
                />
                <ProFormSelect
                  name="factoryId"
                  width="sm"
                  placeholder={intl.formatMessage({id: "assets.hosts.form.factory.name"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.form.factory.name"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.form.factory.name"})}
                  request={async () => {
                    const params = {}
                    if (searchFactoryName !== "") {
                      params["name"] = searchFactoryName
                    }
                    const result = await SelectRemoteSearch(params, queryIdcFactoryList,"name", "id")
                    if (props.initialValues && props.initialValues.factoryId > 0) {
                      let f = result.filter(item => item.id === props.initialValues.factoryId)
                      if (f.length === 0) {
                        return await SelectRemoteSearch( {id: props.initialValues.factoryId}, queryIdcFactoryList,"name", "id")
                      }
                    }
                    return result
                  }}
                  fieldProps={{
                    allowClear: true,
                    showSearch: true,
                    onSearch: (value: string) => {
                      setFactoryName(value)
                    }
                  }}
                />
                </ProFormGroup>
                <ProFormGroup>
                <ProFormSelect
                  name="idcRackSlotId"
                  width="sm"
                  placeholder={intl.formatMessage({id: "assets.hosts.detail.idcRack.title"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.detail.idcRack.title"}) }]}
                  label={intl.formatMessage({id: "assets.hosts.detail.idcRack.title"})}
                  request={async () => {
                    const params = {}
                    if (props.initialValues && props.initialValues.idcRackSlotId > 0) {
                      params["filter"] = `id=?${props.initialValues.idcRackSlotId}`
                      const result = await queryIdcRackSlotList(params)
                      return result.data.list.map(item=> {
                        return {
                          label: `${item.idcRack.idcRoom.idc.name}_${item.idcRack.idcRoom.roomName}_${item.idcRack.name}_${item.slot}`,
                          value: item.id
                        }
                      })
                    } else if (searchRackSlotName !== "") {
                      const result = await queryFullNameIdcRackSlot(searchRackSlotName)
                      return result.data.list.map(item=> {
                        return {
                          label: item.name,
                          value: item.id
                        }
                      })
                    }
                    const result = await queryIdcRackSlotList(params)
                    return result.data.list.map(item=> {
                      return {
                        label: `${item.idcRack.idcRoom.idc.name}_${item.idcRack.idcRoom.roomName}_${item.idcRack.name}_${item.slot}`,
                        value: item.id
                      }
                    })
                  }}
                  fieldProps={{
                    allowClear: true,
                    showSearch: true,
                    onSearch: (value: string) => {
                      setRackSlotName(value)
                    }
                  }}
                />

                <ProFormDateTimePicker
                  width="sm"
                  name="arrivalTime"
                  placeholder={intl.formatMessage({id: "assets.hosts.column.arrivalTime"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.arrivalTime"}) }]}
                  label={intl.formatMessage({id: 'assets.hosts.column.arrivalTime'})} />
                <ProFormDateTimePicker
                  width="sm"
                  name="overdueTime"
                  placeholder={intl.formatMessage({id: "assets.hosts.column.overdueTime"})}
                  rules={[{ required: true, message: intl.formatMessage({id: "assets.hosts.column.overdueTime"}) }]}
                  label={intl.formatMessage({id: 'assets.hosts.column.overdueTime'})} />
                </ProFormGroup>
            </ProCard>
            </ProForm>
        }
        />
    </Access>
  )
}
