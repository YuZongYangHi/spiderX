import Hosts from './Machine'
import HostDetail from './Machine/detail'
import {CreateServerComponent} from './Machine/handler/create'
import {UpdateServerComponent} from './Machine/handler/update'

const routerList = [
  {
    path: "/:treeId/machine/:serverId/update",
    element: <UpdateServerComponent/>
  }, {
    path: "/:treeId/machine/create",
    element: <CreateServerComponent/>
  },
  {
    path: "/:treeId/machine/:serverId/detail",
    element:<HostDetail/>
  },
  {
    path: "/:treeId/machine",
    element: <Hosts/>
  }
]

export default routerList;
