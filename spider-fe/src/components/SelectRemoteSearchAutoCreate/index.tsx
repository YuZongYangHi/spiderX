import React, {useState, useRef, useEffect} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Space, Button } from 'antd';
import type { InputRef } from 'antd';
import {ProFormSelect} from '@ant-design/pro-components'
import {useIntl} from "umi";

let index = 0;

export default (props: SelectRemoteSearchAutoCreateRequest.Params) => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [searchName, setSearchName] = useState("")
  const intl = useIntl()

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const fetch = async (params: object) => {
    const result = await props.request(params)
    if (!result.success) {
      return []
    }
    const options = result.data.list.map((item: { [x: string]: any; }) => {
      return {
        label: item[props.option.label],
        value: item[props.option.value]
      }
    })
    setItems(options)
  }

  useEffect(() => {
    fetch(props.params)
  }, [])

  useEffect(() => {
    if (searchName !== "") {
      const params = {
        [props.option.label]: searchName
      }
      fetch(params)
    }
  }, [searchName])
  return (
    <ProFormSelect
      label={intl.formatMessage({id: props.label})}
      name={props.name}
      width={props.width}
      rules={[{ required: true, message: intl.formatMessage({id: props.label}) }]}
      placeholder={props.placeholder}
      convertValue={(value:any) => {
        return value ? value.map(item => typeof item === 'object' ? item[props.option.label] : item) : []
      }}
      transform={(value: string) => {
        return {
          [props.name]: value.map(item => typeof item === 'object' ? item[props.option.label] : item)
        }
      }}
      fieldProps={{
        mode: 'multiple',
        allowClear: true,
        showSearch: true,
        onSearch: (value: string) => {
          setSearchName(value)
        },
        dropdownRender: (menu) => {
         return <>
            {menu}
            <Divider style={{margin: '8px 0'}}/>
            <Space style={{padding: '0 8px 4px'}}>
              <Input
                placeholder={props.placeholder}
                ref={inputRef}
                value={name}
                onChange={onNameChange}
                onKeyDown={(e) => e.stopPropagation()}
              />
              <Button type="text" icon={<PlusOutlined/>} onClick={addItem}>
                {intl.formatMessage({id: props.buttonTitle})}
              </Button>
            </Space>
          </>
        }
      }}
      options={items}
    />
  );
};

