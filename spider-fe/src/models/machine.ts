import {useState} from "react";

export default () => {
  const [treeId, setTreeId] = useState(0);
  return {
    treeId, setTreeId
  }
}
