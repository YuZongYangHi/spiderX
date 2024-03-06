import * as React from 'react';
import "./index.less"
import {Divider, Space} from "antd";
import { LeftOutlined } from '@ant-design/icons'
import {history} from 'umi'

export interface IProps  {
  title: string
}

export interface BackTitleProps  {
  title: string;
  uri: string;
}

export class ComponentTitle extends React.Component<IProps> {

  public render() {
    const {title} = this.props

    return (
      <div className="component-title">{title}</div>
    )
  }
}

export class LargeTitle extends React.Component<IProps> {

  public render() {
    const {title} = this.props

    return (
      <div className="large-component-title">{title}</div>
    )
  }
}

export const BackTitle = (props: BackTitleProps) => {
  return (
    <div style={{width: "100%"}}>
      <Space>
        <span style={{cursor: 'pointer'}} onClick={()=>history.push(props.uri)}><LeftOutlined/></span>
        <span style={{fontSize: 16}}>{props.title}</span>
      </Space>
      <Divider/>
    </div>
  )
}
