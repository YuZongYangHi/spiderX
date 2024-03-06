import {Flex, Space} from 'antd';
import Butterfly from '/public/img/13C2C2.svg'

export default (props: any) => {
  return <Flex vertical gap="small" justify="space-between" style={{marginTop: 12, marginBottom: 12}} >
      <Space >
        <img src={Butterfly} />
        <span>{props.name}</span>
      </Space>

    </Flex>
}
