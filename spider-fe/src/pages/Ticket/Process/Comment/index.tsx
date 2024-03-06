import {forwardRef, useEffect, useState} from "react";
import {ProCard, ProList} from '@ant-design/pro-components';
import {useIntl} from "umi";
import {Flex, Input, Avatar, Button, Space, Tag, Empty, Divider} from "antd";
import {
  addTicketRecordComment,
  listTicketRecordComment
} from '@/services/Ticket/api'
import moment from "moment";

export default forwardRef((props: ProcessParams.Comment, ref)=> {
  const intl = useIntl()
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [commentList, setCommentList] = useState<TicketResponse.commentInfo[]>([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setComment(e.target.value)
  };

  const onSubmit = async () => {
    if (comment === "") {
      return
    }
    setButtonLoading(true)
    const params = {
      content: comment,
      currentState: props.record.state.stateName,
      userId: props.user?.id,
      ticket_workflow_record_id: props.record.id,
    }
    const result = await addTicketRecordComment(props.record.sn, params)
    if (result.success) {
      await fetch()
    }
    setButtonLoading(false)
  }

  const fetch = async () => {
    setLoading(true)
    const result = await listTicketRecordComment(props.record.sn);
    if (result.success) {
      setCommentList(result.data.list || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    (async function init() {
     await fetch()
    }) ()
  }, [])

  return (
    <ProCard
      headerBordered
      loading={loading}
      title={intl.formatMessage({id: 'ticket.workflow.comment.title'})}
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        marginBottom: 24
      }}
    >
      {
        commentList.length > 0 ?
          <>
        <ProList
          style={{
            borderRadius: 8,
            marginBottom: 24
          }}
          rowKey="id"
          dataSource={commentList}
          showActions="hover"
          metas={{
            title: {
              dataIndex: 'userId',
              render: (_, record) => record.user.username
            },
            avatar: {
              dataIndex: 'photo',
              editable: false,
              render: (_, record) => <Avatar src={record.user.photo}/>
            },
            description: {
              dataIndex: 'content',
            },
            subTitle: {
              render: (_, record) => {
                return (
                  <Space size={4}>
                    <span style={{color: '#ccc'}}>{moment(record.createTime).format("YYYY-MM-DD hh:mm:ss")}</span>
                    <Tag color='#2db7f5'>{record.currentState}</Tag>
                    {
                      record.user.isAdmin && <Tag color="#108ee9">{intl.formatMessage({id: 'ticket.workflow.comment.admin'})}</Tag>
                    }
                  </Space>
                );
              },
            }
          }}
        />
          <Divider/>
        </>
           :<div style={{marginBottom: 24}}><Empty  description={intl.formatMessage({id: 'ticket.workflow.comment.empty'})}/></div>
      }
      <Flex gap={10} style={{marginBottom: 24}}>
        <Avatar key="avatar" src={<img src={props.user?props.user.photo : ""} alt={props.user ? props.user.username : ""} />} />
        <Input.TextArea
          key="input"
          maxLength={100}
          showCount
          onChange={onChange}
          placeholder={intl.formatMessage({id: 'ticket.workflow.comment.placeholder'})}
          rows={4}
          style={{ height: 120, resize: 'none' }}
        />
      </Flex>
      <Flex justify="flex-end">
        <Button type="primary" onClick={onSubmit} loading={buttonLoading}>{intl.formatMessage({id: 'ticket.workflow.comment.submit'})}</Button>
      </Flex>
    </ProCard>
  )
})
