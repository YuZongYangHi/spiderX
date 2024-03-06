import {Access, useAccess, useModel, useIntl} from 'umi';
import {ActionType, ColumnsState, PageContainer, ProTable} from "@ant-design/pro-components";
import {DesignProTable} from "@/components/ProTable/typing";
import {checkUserCreatePermissions, checkUserHavePageReadPermissions} from "@/access";
import ForbiddenPage from "@/pages/403";
import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {
  Flex,
  message,
  Modal,
  Space,
  UploadFile,
  UploadProps,
  Upload,
  Button,
  Radio,
  RadioChangeEvent,
  Input
} from "antd";
import {DownOutlined, ExclamationCircleFilled, InboxOutlined, UploadOutlined} from "@ant-design/icons";
import moment from "moment";
import ExportJsonExcel from "js-export-excel"
import {SortOrder} from "antd/lib/table/interface";
import fetchUtil from "@/util/ProTableRequest";

const { confirm } = Modal;
const { Dragger } = Upload;

export default forwardRef((props: DesignProTable.T, ref)=>{
  const actionRef = useRef<ActionType>();
  const intl = useIntl()
  const access = useAccess();
  const {initialState} = useModel("@@initialState")
  const {userMenuPermissions} = initialState ?? {};
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>(props.columnsState ? props.columnsState.defaultValue : {});
  const [selectRowValues, setSelectRowValues] = useState<any[]>([]);
  const [data, setData] = useState([]);
  const [multiUploadOpen, setMultiUploadOpen] = useState(false);
  const [multiUploadConfirm, setMultiUploadConfirm] = useState(false);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [uploadFileDisable, setUploadFileDisbled] = useState(false);
  const [multiSearchVisable, setMultiSearchVisable] = useState(false);
  const [multiSearchLoading, setMultiSearchLoading] = useState(false);
  const [multiSearchFieldType, setMultiSearchFieldType] = useState(props.multiSearch? props.multiSearch.options[0].field : "");
  const [multiSearchContent, setMultiSearchContent] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [multiSearchParams, setMultiSearchParams] = useState({})
  const columnsState = {
    value: columnsStateMap,
    onChange: setColumnsStateMap
  }

  const rowSelection = (handleCustomRowKeys: (rows: any[]) => any[]) => {
    return {
      selections: [],
      defaultSelectedRowKeys: [],
      selectedRowKeys: handleCustomRowKeys(selectRowValues),
      onSelect: (record: any, selected: any) => setSelectRowValues(selected ? Array.from(new Set([...selectRowValues, record])) : selectRowValues.filter(o => o !== record)),
      onSelectAll: (selected: any, selectedRows: any, changeRows: any) => setSelectRowValues(selected ? Array.from(new Set([...selectedRows, ...selectedRows.filter(o => o).map(o => o)])) : selectRowValues.filter(o => !changeRows.find(row => row === o)))
    }
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
    });

    props.batchImport.importRequest(formData).then((res=>{
      if (res.success) {
        const msg = (<div>
          <p>{intl.formatMessage({id: 'assets.node.toolBar.table.import.response.success'})}: {res.data.list && res.data.list.success}, {intl.formatMessage({id: 'assets.node.toolBar.table.import.response.error'})}: {res.data.list && res.data.list.error}</p>
        </div>)
        const cfg = {
          type: 'success',
          content: msg,
          duration: 3,
        }

        if (res.data.list && res.data.list.error > 0) {
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
      if ( file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel") {
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

  const form = {
    syncToInitialValues: false,
    syncToUrl:false
  }

  useImperativeHandle(ref, () => {
    return {
      actionRef,
      data,
      selectRowValues: selectRowValues,
      exportExcel: exportExcel,
      setMultiUploadOpen: setMultiUploadOpen,
      deleteAction
    };
  }, []);

  useImperativeHandle(ref, () => {
    return {
      data,
      actionRef,
      selectRowValues: selectRowValues,
      exportExcel: exportExcel,
      setMultiUploadOpen: setMultiUploadOpen,
      deleteAction
    }
  }, [data])
  const handleMultiUploadCancel = () => {
    setUploadFileList([])
    setMultiUploadOpen(false)
    setUploadFileDisbled(false)
    setMultiUploadConfirm(false)
  }

  const handleMultiDelete = (selectRows: any[]) => {
    return confirm({
      title: intl.formatMessage({id: 'assets.node.table.alert.option.multiDelete.title'}),
      icon: <ExclamationCircleFilled />,
      content: <div><Flex wrap="wrap" gap="small">
        {
          selectRows.map((item, index)=>{
            return (<span key={index}>{item.name}</span>)
          })
        }
      </Flex></div>,
      onOk() {
        const data = {
          ids: selectRows.map((item)=>item.id)
        }
        return props.rowSelection.multiDeleteRequest(data).then((res=>{
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

  const deleteAction = (...params: any) => {
    confirm({
      title: intl.formatMessage({id: "pages.proTable.delete.title"}),
      icon: <ExclamationCircleFilled />,
      content: intl.formatMessage({id: "pages.proTable.delete.content"}),
      onOk() {
        return props.deleteRequest(...params).then((res=>{
          message.success(intl.formatMessage({id: "pages.proTable.delete.success"}))
          actionRef.current?.reload()
        })).catch(err=>{
          message.error(intl.formatMessage({id: "pages.proTable.delete.error"}))
          console.log(err)
        })
      },
      onCancel() {},
    });
  };

  const exportExcel = (fileName: string, sheetName: string, rows: any[]) => {
    if (rows.length === 0) {
      return
    }
    const option = {};
    option.fileName = `${intl.formatMessage({id: fileName})}${moment().format("YYYYMMDDHHmm")}`;
    option.datas = [
      {
        sheetData: rows.map(item => {
          const result = {};
          props.columns.forEach(c => {
            result[c.dataIndex] = c.hasOwnProperty("choices") && c.choices(item[c.dataIndex], item) || item[c.dataIndex];
          });
          return result;
        }),
        sheetName: intl.formatMessage({id: sheetName}),
        sheetFilter: props.columns.map(item => item.dataIndex),
        sheetHeader: props.columns.map(item => item.valueType !== "option" && item.title || ""),
        columnWidths: props.columns.map(() => 10),
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
  const tableAlertRender = ({selectedRowKeys, selectedRows, onCleanSelected,}) => {
    return (
      <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginInlineStart: 8 }} onClick={()=>{
                setSelectRowValues({})
              }}>
                取消选择
              </a>
            </span>
      </Space>
    )
  }

  const tableAlertOptionRender = () => {
    return (
      <Space size={16}>
        <a target="_blank" href="/#" rel="noreferrer" onClick={(e)=>{
          e.preventDefault()
          handleMultiDelete(selectRowValues)}}>{intl.formatMessage({id: 'assets.node.table.alert.option.multiDelete'})}</a>
        <a target="_blank" href="/#" rel="noreferrer" onClick={(e)=>{
          e.preventDefault()
          exportExcel(props.rowSelection.exportFileName, props.rowSelection.exportSheetName, selectRowValues)}}>{intl.formatMessage({id: 'assets.node.table.alert.option.exportData'})}</a>
      </Space>
    )
  }

  const fetch = async (params: object, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
   const fetchParams = {
     ...props.fetchParams,
     requestQueryFieldOptions: [...props.fetchParams.requestQueryFieldOptions, ...props.multiSearch && props.multiSearch.status &&  props.multiSearch.options.map(item => item.field) || []]
   }
    const result = await fetchUtil(fetchParams, params, sort, filter)
    if (result.success) {
      setData(result.data)
    }
    return result
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
    <Access
      accessible={checkUserHavePageReadPermissions(props.permissionsMenuKeys, access, userMenuPermissions)}
      fallback={<ForbiddenPage/>}>
      <PageContainer title={false} breadcrumbRender={(value,abc)=> {return props.bread ? "" : abc}} >
        <ProTable
          rowKey="id"
          columnsState={props.columnsState && props.columnsState.status ? columnsState : false}
          defaultSize={props.defaultSize}
          form={props.form ? form : false}
          pagination={{
            showSizeChanger: true,
          }}
          params={Object.keys(multiSearchParams).length > 0 ? {...multiSearchParams} : {}}
          request={fetch}
          scroll={{x: 'max-content'}}
          rowSelection={props.rowSelection && props.rowSelection.status ? rowSelection(props.rowSelection.handleCustomRowKeys) : false}
          tableAlertRender={props.rowSelection && props.rowSelection.status ? tableAlertRender : false}
          tableAlertOptionRender={props.rowSelection && props.rowSelection.status ? tableAlertOptionRender : false}
          actionRef={actionRef}
          columns={props.columns}
          search={props.openSearch}
          toolBarRender={() => [
            props.multiSearch && props.multiSearch.status && <Button onClick={()=>setMultiSearchVisable(true)} type='primary'>{intl.formatMessage({id: 'menu.table.multiSearch'})}</Button>,
            props.batchImport &&  props.batchImport.status && checkUserCreatePermissions(props.permissionsMenuKeys, userMenuPermissions) && <Button key="in" onClick={()=>{setMultiUploadOpen(true)}} >{intl.formatMessage({id: 'assets.node.toolBar.import'})} <UploadOutlined /></Button>,
            props.batchExport &&  props.batchExport.status && checkUserCreatePermissions(props.permissionsMenuKeys, userMenuPermissions) && <Button key="export" onClick={()=>{
              exportExcel(props.batchExport.fileName, props.batchExport.sheetName, data)
            }} >{intl.formatMessage({id: 'assets.node.toolBar.export'})} <DownOutlined /></Button>,
            ...props.toolBarRender
          ]}
          onReset={()=>{
            setMultiSearchParams({})
          }}
          onSubmit={()=>{
            setMultiSearchParams({})
          }}
        />

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
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{intl.formatMessage({id: 'assets.node.toolBar.table.import.title'})}</p>
              <p className="ant-upload-hint">
                {intl.formatMessage({id: 'assets.node.toolBar.table.import.description'})}
              </p>
            </Dragger>
            <div style={{height: 10, marginTop: 5, marginBottom: 20}}>
              <a style={{float: 'right'}} href={props.batchImport && props.batchImport.importTemplatePath}>{intl.formatMessage({id: 'assets.node.toolBar.table.import.templateName'})}</a>
            </div>
          </>
        </Modal>
        {contextHolder}

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
          <Radio.Group onChange={multiSearchFieldTypeChange} defaultValue={props.multiSearch && props.multiSearch.status && props.multiSearch.options[0].field || ""}>
            {props.multiSearch && props.multiSearch.options.map((item, index) => (
              <Radio.Button  key={index} value={item.field}>{intl.formatMessage({id: item.label})}</Radio.Button>
            ))}
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
      </PageContainer>
    </Access>
  )
})
