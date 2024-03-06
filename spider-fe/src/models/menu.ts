import {useState} from "react";

export default () => {

  // 点击操作设置当前的记录行
  const [currentMenuRow, setCurrentMenuRow] = useState<MenuResponse.MenuInfo>();

  // 修改模态矿显示
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  // 创建模态框显示
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  // 菜单列表数据
  const [menuList, setMenuList] = useState<MenuResponse.MenuInfo[]>([]);

  return {
    currentMenuRow, setCurrentMenuRow,
    updateModalOpen, handleUpdateModalOpen,
    createModalOpen, handleModalOpen,
    menuList, setMenuList
  }
}
