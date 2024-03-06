import {SelectLang as UmiSelectLang} from "@umijs/max";
import React from "react";

const langOptions = [
  {
    lang: 'zh-CN',
    label: '简体中文',
    icon: '🇨🇳',
    title: '语言',
  },
  {
    lang: 'en-US',
    label: 'English',
    icon: '🇺🇸',
    title: 'Language',
  },
]

export default () => {
  return (
    <UmiSelectLang
      postLocalesData={()=>langOptions}
      style={{
        padding: 4,
      }}
    />
  );
};
