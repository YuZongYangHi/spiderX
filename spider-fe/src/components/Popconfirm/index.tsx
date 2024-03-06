import {useState, forwardRef, useImperativeHandle} from "react";
import {Popconfirm} from 'antd'
import {PopconfirmType} from "@/components/Popconfirm/typing";

export default forwardRef((props: PopconfirmType, ref) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
    setConfirmLoading(false)
  };

  useImperativeHandle(ref, () => {
    return {
      open: open,
      setOpen,
      setConfirmLoading,
      confirmLoading,
      handleCancel
    };
  }, []);
  return (
    <Popconfirm
      title={props.title}
      description={props.description}
      open={open}
      onConfirm={async () => {
        await props.onConfirm()
      }}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
    >
      <span key="popconfirm" onClick={showPopconfirm}>{props.element}</span>
    </Popconfirm>
  );
})
