import "./index.css"
import {forwardRef, useImperativeHandle, useState} from "react";
import {Flex, Modal, Avatar, Divider} from "antd";
import {StorageHouse} from "@/components/IconStoreHouse/storageHouse";

const icons = StorageHouse()
export default forwardRef((props: any, ref)=>{
  const [open, handleOpen] = useState(false)
  const [currentIcon, setIcon] = useState("CameraTwoTone")

  useImperativeHandle(ref, () => {
    return {
      handleOpen: handleOpen,
      icon: currentIcon,
      setIcon: setIcon
    }
  })

  useImperativeHandle(ref, () => {
    return {
      handleOpen: handleOpen,
      icon: currentIcon,
      setIcon: setIcon
    }
  }, [currentIcon])

  return (
    <Modal
      width={680}
      title="icon库"
      destroyOnClose={true}
      visible={open}
      onCancel={()=>handleOpen(false)}
      onOk={()=>{
        props.setIcon(currentIcon)
        handleOpen(false)}
    }
    >
      <Divider/>
      <Flex gap="large" wrap="wrap">
        {Object.keys(icons).map((item, index)=>
          <Avatar
            className={item === currentIcon ? "" : "icon-default-opacity" }
            onClick={()=>setIcon(item)}
            key={index}
            shape="square"
            size={40}
            style={{ backgroundColor: '#068DEC', cursor: "pointer" }}
            icon={icons[item]}
          />
        )}
      </Flex>
    </Modal>
  )
})
