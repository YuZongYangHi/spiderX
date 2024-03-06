import "./index.css"
import {Card, List, Space, Flex} from 'antd';
import {useEffect, useState} from "react";
import {useParams, history} from "umi";
import {findCategoryDocumentListByCategoryId} from '@/services/Ticket/api';
import {AlertTwoTone, PhoneTwoTone, FileTwoTone} from '@ant-design/icons'
import {ProCard} from '@ant-design/pro-components'

export default () => {
  const params = useParams();
  const [data, setData] = useState<TicketResponse.WorkflowWikiInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const onFetch = () => {
    setLoading(true)
    findCategoryDocumentListByCategoryId(params.categoryId).then(res=>{
      if (res.success) {
        setData(res.data.list);
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    onFetch()
  }, [params.categoryId])

  const handleRedirectSubmitPage = () => {
    history.push(`/ticket/product/${params.productId}/category/${params.categoryId}/submit`)
  }

  return  <div
    style={{
      width: '60%',
      marginLeft: 24,
    }}
  >
    <Card
      style={{
        width: '100%',
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        boxShadow: '0 1px 4px rgba(0, 21, 41, .08)',
    }}
      title={<Space size={3}><span><AlertTwoTone /></span> <span>已为您推荐解决率最高的热门知识点, 可能有您需要的答案：</span></Space>}
    >
      <List
        loading={loading}
        dataSource={data}
        grid={{ column: 2 }}
        renderItem={item => (
          <List.Item>
              <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
          </List.Item>
        )}
      />
    </Card>

    <div
      style={{
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <div style={{
        fontSize: 15,
        fontWeight: 400,
        color: "#555"

      }}>您还可以通过以下渠道提交您的问题：</div>
    </div>

    <Flex
      justify="space-between"
      align="center"
      style={{
        width: "100%",
    }}>
      <ProCard
        className="document-button"
        layout="center">
        <Space>
          <span><PhoneTwoTone /></span>
          <span>智能在线</span>
        </Space>
      </ProCard>
      <ProCard
        onClick={handleRedirectSubmitPage}
        className="document-button"
        layout="center">
        <Space >
          <span><FileTwoTone /></span>
          <span>创建工单</span>
        </Space>
      </ProCard>
    </Flex>
  </div>
}


