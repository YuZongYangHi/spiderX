import {useModel} from "@@/exports";
import {useEffect, useState} from "react";
import {useParams, history} from "umi";
import {findCategoryListByProductId} from '@/services/Ticket/api';
import {List, Avatar, Flex, Alert} from 'antd'
import {StorageHouse} from "@/components/IconStoreHouse/storageHouse";
import {Outlet} from "react-router-dom";

const icons = StorageHouse()

export default () => {
  const {
    setCurrentStep,
    categoryId, setCategoryId
  } = useModel('ticket');
  const [data, setData] = useState<TicketResponse.CategoryInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams()

  useEffect(() => {
    if (params.categoryId) {
      setCategoryId(parseInt(params.categoryId))
    }

    setLoading(true)
    findCategoryListByProductId(params.productId).then(res=> {
      if (res.success) {
        setData(res.data.list);
        setLoading(false);
      }
    })
  }, [])

  const handleClickCategory = (item: TicketResponse.CategoryInfo) => {
    setCategoryId(item.id)
    setCurrentStep(2)
    history.push(`/ticket/product/${item.product.id}/category/${item.id}/document`)
  }

  return (
    <div>
      <Flex>
        <Flex vertical style={{width: "40%"}}>
          <Alert
            message="请选择您遇到的问题分类："
            showIcon
            style={{ boxShadow: '0 1px 4px rgba(0,21,41,.08)', marginBottom: 20 }}
            type="info"
          />
          <List
            style={{
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              padding: 8,
              boxShadow: '0 1px 4px rgba(0, 21, 41, .08)',

            }}
            itemLayout="horizontal"
            dataSource={data}
            loading={loading}
            renderItem={(item, index) => (
              <List.Item style={{cursor: 'pointer'}} onClick={() => {handleClickCategory(item)}}>
                <List.Item.Meta
                  avatar={<Avatar icon={icons[item.icon]} style={{background: "#fff"}} />}
                  title={<span style={{cursor: 'pointer',  color: item.id === categoryId ? "#13c2c2" : ""}} >{item.name}</span>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Flex>
      <Outlet/>
    </Flex>
    </div>
  )
}
