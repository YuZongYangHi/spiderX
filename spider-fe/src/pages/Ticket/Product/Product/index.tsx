import {Card, List, Avatar, Flex, Button} from 'antd';
const { Meta } = Card;
import {StorageHouse} from "@/components/IconStoreHouse/storageHouse";
import {useModel, history} from "umi";
import {useEffect, useState} from "react";
import {findProductList} from '@/services/Ticket/api'
const icons = StorageHouse()

export default () => {
  const {
    productId, setProductId,
    setCurrentStep
  } = useModel('ticket');
  const [data, setData] = useState<TicketResponse.ProductInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setCurrentStep(0)
    setLoading(true);
    findProductList().then(res=>{
      setData(res.data.list);
      setLoading(false);
    })
  }, [])

  const handleNextNode = (item: TicketResponse.ProductInfo) => {
    setCurrentStep(1)
    setProductId(item.id)
    history.push(`/ticket/product/${item.id}/category`)
  }

  return  <>
    <List
    loading={loading}
    grid={{ gutter: 16, column: 4}}
    dataSource={data}
    renderItem={(item) => (
      <List.Item>
        <Card
          style={{boxShadow: "0 1px 4px rgba(0, 21, 41, .08)", height: 120, }}
          hoverable={true}
        ><Meta
          avatar={<Avatar icon={icons[item.icon]} style={{background: "#fff"}} /> }
          title={item.name}
          description={
          <Flex>
            {item.description}
            <Flex align="center" justify="flex-end" style={{width: "100%"}} >
              <Button
                onClick={()=> handleNextNode(item)}
                style={{display: "inline-block", float: "right"}}
                type="primary">进入</Button>
            </Flex>
          </Flex>}
        /></Card>
      </List.Item>
    )}
  />
    </>
}
