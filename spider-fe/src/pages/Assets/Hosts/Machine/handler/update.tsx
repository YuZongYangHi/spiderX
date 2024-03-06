import {updateServer, queryServerById} from "@/services/Assets/Server/api";
import FormPage from "@/pages/Assets/Hosts/Machine/handler/index";
import Loading from '@/components/Loading'
import {useEffect, useState} from "react";
import {useIntl, useParams, history} from "umi";

export const UpdateServerComponent = () => {
  const [loading, setLoading] = useState(true)
  const intl = useIntl()
  const params = useParams()
  const [server, setServer] = useState<ServerResponse.ServerInfo>({});

  const formPageParams: ServerForm.Params = {
    title: "assets.hosts.update.title",
    handleType: "update",
    request: updateServer,
    initialValues: server
  }

  useEffect(()=>{
    const serverId = parseInt(params.serverId)
    if (!serverId) {
      history.push('/404')
    }
    queryServerById(serverId).then(res=> {
      if (res.success) {
        setServer(res.data.list)
        setLoading(false)
      }
    })
  }, [])
  return (
      loading ? <Loading/> :<FormPage {...formPageParams}/>
  )
}

