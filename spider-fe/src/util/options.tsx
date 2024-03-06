import {Tag, Badge} from 'antd';

export const apiPermissionsValueEnum = {
  "POST": {
    text: "POST"
  },
  "DELETE": {
    text: "DELETE"
  },
  "PUT": {
    text: "PUT"
  },
  "GET": {
    text: "GET"
  },
}

export const permissionsValueRender = (value: boolean) => {
  return value && <Tag color={"green"}>是</Tag> ||  <Tag color={"red"}>否</Tag>
}

export const userStatusValueRender = (value: boolean) => {
  return value &&  <Badge status="success" text="已激活"/> ||  <Badge status="error" text="未激活" />
}

export const apiVerbValueRender = (value: string) => {
  let color: string;
  switch (value) {
    case "POST":
      color = "green"
      break;

    case "DELETE":
      color = "red"
      break;

    case "PUT":
      color = "yellow"
      break;
    case "GET":
      color = "blue"
      break;
  }
  return <Tag color={color}>{value}</Tag>
}
