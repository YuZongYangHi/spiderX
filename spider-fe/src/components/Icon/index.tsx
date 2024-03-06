import {Flex, Space} from 'antd';
import UrgeIcon from '/public/img/urge.svg';

export const Urge = (props: any) => {
  return <Flex vertical gap="small" justify="space-between" >
    <Space >
      <img src={UrgeIcon} />
      <span>{props.element}</span>
    </Space>

  </Flex>
}
