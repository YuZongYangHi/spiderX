import FormPage from './index'
import {createServer} from "@/services/Assets/Server/api";

export const CreateServerComponent = () => {
  const formPageParams: ServerForm.Params = {
    title: "assets.hosts.create.title",
    handleType: "create",
    request: createServer,

  }
  return (
   <FormPage {...formPageParams}/>
  )
}
