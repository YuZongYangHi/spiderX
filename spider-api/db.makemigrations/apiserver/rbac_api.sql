INSERT INTO rbac_api_action (resource, verb, description) VALUES
('/api/v1/users/login', 'POST', 'user.Login'),
('/api/v1/users/logout', 'GET', 'user.Logout'),
('/api/v1/users/currentUser', 'GET', 'user.CurrentUserInfo'),
('/api/v1/permissions/menu', 'GET', 'menu.List'),
('/api/v1/permissions/menu', 'POST', 'menu.Create'),
('/api/v1/permissions/menu/:id', 'DELETE', 'menu.Delete'),
('/api/v1/permissions/menu/:id', 'PUT', 'menu.Update'),
('/api/v1/permissions/menu/role', 'POST', 'menu.RoleCreate'),
('/api/v1/permissions/menu/role/:id', 'DELETE', 'menu.RoleDelete'),
('/api/v1/permissions/menu/role/:id', 'PUT', 'menu.RoleUpdate'),
('/api/v1/permissions/menu/role', 'GET', 'menu.RoleList'),
('/api/v1/permissions/menu/:id/grant/group', 'GET', 'menu.GroupPermissionsList'),
('/api/v1/permissions/menu/:menuId/grant/group/:permissionId', 'DELETE', 'menu.GroupPermissionsDelete'),
('/api/v1/permissions/menu/:menuId/grant/group/:permissionId', 'PUT', 'menu.GroupPermissionsUpdate'),
('/api/v1/permissions/menu/:menuId/grant/group', 'POST', 'menu.GroupPermissionsCreate'),
('/api/v1/permissions/menu/:menuId/grant/user', 'POST', 'menu.UserPermissionsCreate'),
('/api/v1/permissions/menu/:id/grant/user', 'GET', 'menu.UserPermissionsList'),
('/api/v1/permissions/menu/:menuId/grant/user/:permissionId', 'DELETE', 'menu.UserPermissionsDelete'),
('/api/v1/permissions/menu/:menuId/grant/user/:permissionId', 'PUT', 'menu.UserPermissionsUpdate'),
('/api/v1/permissions/menu/:id/users', 'GET', 'menu.UserList'),
('/api/v1/permissions/menu/:id/groups', 'GET', 'menu.GroupList'),
('/api/v1/permissions/menu/role/:roleId/resource', 'GET', 'menu.RoleResourceList'),
('/api/v1/permissions/menu/role/:roleId/resource', 'POST', 'menu.RoleResourceCreate'),
('/api/v1/permissions/menu/role/:roleId/resource/:resourceId', 'DELETE', 'menu.RoleResourceDelete'),
('/api/v1/permissions/menu/role/:roleId/resource/menus', 'GET', 'menu.RoleResourceMenuList'),
('/api/v1/permissions/menu/role/:roleId/allocation/group', 'GET', 'menu.RoleAllocationGroupList'),
('/api/v1/permissions/menu/role/:roleId/allocation/group/:id', 'DELETE', 'menu.RoleAllocationGroupDelete'),
('/api/v1/permissions/menu/role/:roleId/allocation/group', 'POST', 'menu.RoleAllocationGroupCreate'),
('/api/v1/permissions/menu/role/:roleId/allocation/group/available', 'GET', 'menu.RoleAllocationAvailableGroup'),

('/api/v1/permissions/menu/role/:roleId/allocation/user', 'GET', 'menu.RoleAllocationUserList'),
('/api/v1/permissions/menu/role/:roleId/allocation/user/:id', 'DELETE', 'menu.RoleAllocationUserDelete'),
('/api/v1/permissions/menu/role/:roleId/allocation/user', 'POST', 'menu.RoleAllocationUserCreate'),
('/api/v1/permissions/menu/role/:roleId/allocation/user/available', 'GET', 'menu.RoleAllocationAvailableUser'),

('/api/v1/permissions/users', 'GET', 'user.List'),
('/api/v1/permissions/users', 'POST', 'user.Create'),
('/api/v1/permissions/users/:userId', 'PUT', 'user.Update'),
('/api/v1/permissions/users/:userId', 'DELETE', 'user.Delete'),

('/api/v1/permissions/groups', 'GET', 'group.List'),
('/api/v1/permissions/groups', 'POST', 'group.Create'),
('/api/v1/permissions/groups/:groupId', 'PUT', 'group.Update'),
('/api/v1/permissions/groups/:groupId', 'DELETE', 'group.Delete'),
('/api/v1/permissions/groups/all', 'GET', 'group.ListALL'),

('/api/v1/permissions/actions', 'GET', 'rbac.ActionList'),
('/api/v1/permissions/actions', 'POST', 'rbac.ActionCreate'),
('/api/v1/permissions/actions/:id', 'DELETE', 'rbac.ActionDelete'),
('/api/v1/permissions/actions/:id', 'PUT', 'rbac.ActionUpdate'),

('/api/v1/permissions/roles', 'GET', 'rbac.RoleList'),
('/api/v1/permissions/roles', 'POST', 'rbac.RoleCreate'),
('/api/v1/permissions/roles/:id', 'DELETE', 'rbac.RoleDelete'),
('/api/v1/permissions/roles/:id', 'PUT', 'rbac.RoleUpdate'),

('/api/v1/permissions/roles/:roleId/resources', 'GET', 'rbac.RoleResourceList'),
('/api/v1/permissions/roles/:roleId/resources', 'POST', 'rbac.RoleResourceCreate'),
('/api/v1/permissions/roles/:roleId/resources/:resourceId', 'DELETE', 'rbac.RoleResourceDelete'),
('/api/v1/permissions/roles/:roleId/available/resources', 'GET', 'rbac.RoleRelAvailableResourceList'),

('/api/v1/permissions/roles/:roleId/groups', 'GET', 'rbac.RoleRelGroupList'),
('/api/v1/permissions/roles/:roleId/groups', 'POST', 'rbac.RoleRelGroupCreate'),
('/api/v1/permissions/roles/:roleId/groups/:id', 'DELETE', 'rbac.RoleRelGroupDelete'),
('/api/v1/permissions/roles/:roleId/available/groups', 'GET', 'rbac.RoleRelAvailableGroups'),
('/api/v1/permissions/roles/:roleId/users', 'GET', 'rbac.RoleRelUserList'),
('/api/v1/permissions/roles/:roleId/users', 'POST', 'rbac.RoleRelUserCreate'),
('/api/v1/permissions/roles/:roleId/users/:id', 'DELETE', 'rbac.RoleRelUserDelete'),
('/api/v1/permissions/roles/:roleId/available/users', 'GET', 'rbac.RoleRelAvailableUsers'),
('/api/v1/permissions/apiKeys', 'GET', 'rbac.ListAPIKeys'),
('/api/v1/permissions/apiKeys/:id', 'DELETE', 'rbac.DeleteAPIKey'),
('/api/v1/permissions/apiKeys', 'POST', 'rbac.CreateAPIKey'),

('/api/v1/assets/ipRange', 'GET', 'ip_range.List'),
('/api/v1/assets/ipRange', 'POST', 'ip_range.Create'),
('/api/v1/assets/ipRange/:id', 'GET', 'ip_range.Retrieve'),
('/api/v1/assets/ipRange/:id', 'PUT', 'ip_range.Update'),
('/api/v1/assets/ipRange/:id', 'DELETE', 'ip_range.Delete'),

('/api/v1/assets/ip', 'GET', 'ip.List'),
('/api/v1/assets/ip', 'POST', 'ip.Create'),
('/api/v1/assets/ip/:id', 'GET', 'ip.Retrieve'),
('/api/v1/assets/ip/:id', 'PUT', 'ip.Update'),
('/api/v1/assets/ip/:id', 'DELETE', 'ip.Delete'),

('/api/v1/assets/switch', 'GET', 'net_device.SwitchList'),
('/api/v1/assets/switch', 'POST', 'net_device.SwitchCreate'),
('/api/v1/assets/switch/:id', 'GET', 'net_device.SwitchRetrieve'),
('/api/v1/assets/switch/:id', 'PUT', 'net_device.SwitchUpdate'),
('/api/v1/assets/switch/:id', 'DELETE', 'net_device.SwitchDelete'),

('/api/v1/assets/router', 'GET', 'net_device.RouterList'),
('/api/v1/assets/router', 'POST', 'net_device.RouterCreate'),
('/api/v1/assets/router/:id', 'GET', 'net_device.RouterRetrieve'),
('/api/v1/assets/router/:id', 'PUT', 'net_device.RouterUpdate'),
('/api/v1/assets/router/:id', 'DELETE', 'net_device.RouterDelete'),

('/api/v1/audit/:id/operateLog', 'GET', 'audit.OperateLog'),
('/api/v1/audit/operate', 'GET', 'audit.OperateLogList'),
('/api/v1/audit/login', 'GET', 'audit.UserLoginList'),

('/api/v1/idc/provider', 'GET', 'idc.ProviderList'),
('/api/v1/idc/provider/:id', 'GET', 'idc.ProviderRetrieve'),
('/api/v1/idc/provider/:id', 'PUT', 'idc.ProviderUpdate'),
('/api/v1/idc/provider/:id', 'DELETE', 'idc.ProviderDestroy'),
('/api/v1/idc/provider', 'POST', 'idc.ProviderCreate'),

('/api/v1/idc/factory', 'GET', 'idc.FactoryList'),
('/api/v1/idc/factory/:id', 'GET', 'idc.FactoryRetrieve'),
('/api/v1/idc/factory/:id', 'PUT', 'idc.FactoryUpdate'),
('/api/v1/idc/factory/:id', 'DELETE', 'idc.FactoryDestroy'),
('/api/v1/idc/factory', 'POST', 'idc.FactoryCreate'),

('/api/v1/oncall/list', 'GET', 'duty_roster.ListOnCall'),
('/api/v1/oncall/exchange', 'POST', 'duty_roster.Exchange'),
('/api/v1/oncall/drawLots', 'GET', 'duty_roster.ListDrawLots'),
('/api/v1/oncall/drawLots', 'POST', 'duty_roster.CreateDrawLots'),
('/api/v1/oncall/drawLots/:id', 'DELETE', 'duty_roster.DestroyDrawLots'),
('/api/v1/oncall/drawLots/:id', 'PUT', 'duty_roster.UpdateDrawLots'),

('/api/v1/ticket/product', 'GET', 'ticket.ListProduct'),
('/api/v1/ticket/product/:productId/category', 'GET', 'ticket.ListCategory'),
('/api/v1/ticket/category/:categoryId/document', 'GET', 'ticket.ListDocument'),
('/api/v1/ticket/category/:categoryId/customForm', 'GET', 'ticket.ListCustomForm'),
('/api/v1/ticket/category/:categoryId/record', 'POST', 'ticket.CreateTicketRecord'),
('/api/v1/ticket/category/:categoryId/record/:sn', 'PUT', 'ticket.UpdateTicketRecord'),
('/api/v1/ticket/record/todo/list', 'GET', 'ticket.ListTicketTodoRecord'),
('/api/v1/ticket/record/done/list', 'GET', 'ticket.ListTicketDoneRecord'),
('/api/v1/ticket/record/apply/list', 'GET', 'ticket.ListTicketApplyRecord'),
('/api/v1/ticket/record/:id', 'DELETE', 'ticket.DestroyRecord'),
('/api/v1/ticket/record/:sn/discard', 'PUT', 'ticket.RecordDiscard'),

('/api/v1/ticket/record/:id/flowLogs', 'GET', 'ticket.ListRecordFlowLog'),
('/api/v1/ticket/record/:sn/transition', 'GET', 'ticket.ListProcessButtonTransition'),
('/api/v1/ticket/record/:sn/form', 'GET', 'ticket.ListProcessForm'),
('/api/v1/ticket/record/:sn', 'GET', 'ticket.RetrieveRecord'),
('/api/v1/ticket/record/:sn/hasPermissions', 'GET', 'ticket.CheckUserHasRecordLookPermissions'),
('/api/v1/ticket/record/:sn/nodeState/list', 'GET', 'ticket.ListNodeByRecordSn'),
('/api/v1/ticket/record/:sn/:nodeId/urge', 'GET', 'ticket.GetRecordNodeStateUrge'),
('/api/v1/ticket/record/:sn/:nodeId/urge', 'PUT', 'ticket.SendRecordNodeStateUrge'),
('/api/v1/ticket/record/:sn/comment', 'GET', 'ticket.ListRecordComment'),
('/api/v1/ticket/record/:sn/comment', 'POST', 'ticket.AddRecordComment'),

('/api/v1/ticket/formRemoteSearch/userList', 'GET', 'ticket.FormRemoteSearchUserList'),

('/api/v1/ticket/engine/product', 'GET', 'ticket.ListEngineProduct'),
('/api/v1/ticket/engine/product/:id', 'DELETE', 'ticket.DestroyEngineProduct'),
('/api/v1/ticket/engine/product/:id', 'PUT', 'ticket.UpdateEngineProduct'),
('/api/v1/ticket/engine/product/:id', 'GET', 'ticket.RetrieveEngineProduct'),
('/api/v1/ticket/engine/product', 'POST', 'ticket.CreateEngineProduct'),
('/api/v1/ticket/engine/product/:id/category', 'GET', 'ticket.ListEngineProductCategory'),

('/api/v1/ticket/engine/category', 'GET', 'ticket.ListEngineCategory'),
('/api/v1/ticket/engine/category/:id', 'DELETE', 'ticket.DestroyEngineCategory'),
('/api/v1/ticket/engine/category/:id', 'PUT', 'ticket.UpdateEngineCategory'),
('/api/v1/ticket/engine/category/:id', 'GET', 'ticket.RetrieveEngineCategory'),
('/api/v1/ticket/engine/category', 'POST', 'ticket.CreateEngineCategory'),
('/api/v1/ticket/engine/category/:categoryId/document', 'GET', 'ticket.ListEngineCategoryDocumentByCategoryId'),
('/api/v1/ticket/engine/category/:categoryId/state', 'GET', 'ticket.ListNodeStateByWorkflowId'),
('/api/v1/ticket/engine/category/:categoryId/transition', 'GET', 'ticket.ListNodeStateTransitionByWorkflowId'),
('/api/v1/ticket/engine/category/:categoryId/customForm', 'GET', 'ticket.ListWorkflowCustomFormByWorkflowId'),

('/api/v1/ticket/engine/category/document', 'GET', 'ticket.ListEngineCategoryDocument'),
('/api/v1/ticket/engine/category/document/:id', 'DELETE', 'ticket.DestroyEngineCategoryDocument'),
('/api/v1/ticket/engine/category/document/:id', 'PUT', 'ticket.UpdateEngineCategoryDocument'),
('/api/v1/ticket/engine/category/document/:id', 'GET', 'ticket.RetrieveEngineCategoryDocument'),
('/api/v1/ticket/engine/category/document', 'POST', 'ticket.CreateEngineCategoryDocument'),

('/api/v1/ticket/engine/workflow/state', 'GET', 'ticket.ListNodeState'),
('/api/v1/ticket/engine/workflow/state/:id', 'DELETE', 'ticket.DestroyWorkflowNodeState'),
('/api/v1/ticket/engine/workflow/state/:id', 'PUT', 'ticket.UpdateWorkflowNodeState'),
('/api/v1/ticket/engine/workflow/state/:id', 'GET', 'ticket.RetrieveWorkflowNodeState'),
('/api/v1/ticket/engine/workflow/state', 'POST', 'ticket.CreateWorkflowNodeState'),

('/api/v1/ticket/engine/workflow/transition', 'GET', 'ticket.ListNodeStateTransition'),
('/api/v1/ticket/engine/workflow/transition/:id', 'DELETE', 'ticket.DestroyWorkflowNodeStateTransition'),
('/api/v1/ticket/engine/workflow/transition/:id', 'PUT', 'ticket.UpdateWorkflowNodeStateTransition'),
('/api/v1/ticket/engine/workflow/transition/:id', 'GET', 'ticket.RetrieveWorkflowNodeStateTransition'),
('/api/v1/ticket/engine/workflow/transition', 'POST', 'ticket.CreateWorkflowNodeStateTransition'),

('/api/v1/ticket/engine/workflow/customForm', 'GET', 'ticket.ListWorkflowCustomForm'),
('/api/v1/ticket/engine/workflow/customForm/:id', 'DELETE', 'ticket.DestroyWorkflowCustomForm'),
('/api/v1/ticket/engine/workflow/customForm/:id', 'PUT', 'ticket.UpdateWorkflowCustomForm'),
('/api/v1/ticket/engine/workflow/customForm/:id', 'GET', 'ticket.RetrieveWorkflowCustomForm'),
('/api/v1/ticket/engine/workflow/customForm', 'POST', 'ticket.CreateWorkflowCustomForm'),

('/api/v1/idc/provider', 'GET', 'idc.ProviderList'),
('/api/v1/idc/provider/:id', 'GET', 'idc.ProviderRetrieve'),
('/api/v1/idc/provider/:id', 'PUT', 'idc.ProviderUpdate'),
('/api/v1/idc/provider/:id', 'DELETE', 'idc.ProviderDestroy'),
('/api/v1/idc/provider', 'POST', 'idc.ProviderCreate'),

('/api/v1/idc/factory', 'GET', 'idc.FactoryList'),
('/api/v1/idc/factory/:id', 'GET', 'idc.FactoryRetrieve'),
('/api/v1/idc/factory/:id', 'PUT', 'idc.FactoryUpdate'),
('/api/v1/idc/factory/:id', 'DELETE', 'idc.FactoryDestroy'),
('/api/v1/idc/factory', 'POST', 'idc.FactoryCreate'),

('/api/v1/idc/suit', 'GET', 'idc.SuitList'),
('/api/v1/idc/suit/:id', 'GET', 'idc.SuitRetrieve'),
('/api/v1/idc/suit/:id', 'PUT', 'idc.SuitUpdate'),
('/api/v1/idc/suit/:id', 'DELETE', 'idc.SuitDestroy'),
('/api/v1/idc/suit', 'POST', 'idc.SuitCreate'),

('/api/v1/idc/suit/type', 'GET', 'idc.SuitTypeList'),
('/api/v1/idc/suit/type/:id', 'GET', 'idc.SuitTypeRetrieve'),
('/api/v1/idc/suit/type/:id', 'PUT', 'idc.SuitTypeUpdate'),
('/api/v1/idc/suit/type/:id', 'DELETE', 'idc.SuitTypeDestroy'),
('/api/v1/idc/suit/type', 'POST', 'idc.SuitTypeCreate'),

('/api/v1/idc/suit/season', 'GET', 'idc.SuitSeasonList'),
('/api/v1/idc/suit/season/:id', 'GET', 'idc.SuitSeasonRetrieve'),
('/api/v1/idc/suit/season/:id', 'PUT', 'idc.SuitSeasonUpdate'),
('/api/v1/idc/suit/season/:id', 'DELETE', 'idc.SuitSeasonDestroy'),
('/api/v1/idc/suit/season', 'POST', 'idc.SuitSeasonCreate'),

('/api/v1/idc/az', 'GET', 'idc.AzList'),
('/api/v1/idc/az/:id', 'GET', 'idc.AzRetrieve'),
('/api/v1/idc/az/:id', 'PUT', 'idc.AzUpdate'),
('/api/v1/idc/az/:id', 'DELETE', 'idc.AzDestroy'),
('/api/v1/idc/az', 'POST', 'idc.AzCreate'),
('/api/v1/idc/az/multiDelete', 'POST', 'idc.AzMultiDelete'),
('/api/v1/idc/az/multiImport', 'POST', 'idc.AzMultiImport'),

('/api/v1/idc/idc', 'GET', 'idc.IdcList'),
('/api/v1/idc/idc/:id', 'GET', 'idc.IdcRetrieve'),
('/api/v1/idc/idc/:id', 'PUT', 'idc.IdcUpdate'),
('/api/v1/idc/idc/:id', 'DELETE', 'idc.IdcDestroy'),
('/api/v1/idc/idc', 'POST', 'idc.IdcCreate'),

('/api/v1/idc/room', 'GET', 'idc.IdcRoomList'),
('/api/v1/idc/room/:id', 'GET', 'idc.IdcRoomRetrieve'),
('/api/v1/idc/room/:id', 'PUT', 'idc.IdcRoomUpdate'),
('/api/v1/idc/room/:id', 'DELETE', 'idc.IdcRoomDestroy'),
('/api/v1/idc/room', 'POST', 'idc.IdcRoomCreate'),

('/api/v1/idc/rack', 'GET', 'idc.IdcRackList'),
('/api/v1/idc/rack/:id', 'GET', 'idc.IdcRackRetrieve'),
('/api/v1/idc/rack/:id', 'PUT', 'idc.IdcRackUpdate'),
('/api/v1/idc/rack/:id', 'DELETE', 'idc.IdcRackDestroy'),
('/api/v1/idc/rack', 'POST', 'idc.IdcRackCreate'),



('/api/v1/idc/rack/slot', 'GET', 'idc.RackSlotList'),
('/api/v1/idc/rack/slot/:id', 'GET', 'idc.RackSlotRetrieve'),
('/api/v1/idc/rack/slot/:id', 'PUT', 'idc.RackSlotUpdate'),
('/api/v1/idc/rack/slot/:id', 'DELETE', 'idc.RackSlotDestroy'),
('/api/v1/idc/rack/slot', 'POST', 'idc.RackSlotCreate'),
('/api/v1/idc/rack/slot/queryFullName', 'GET', 'idc.QueryRackSlot'),


('/api/v1/rbac/menu/list', 'GET', 'rbac.MenuList'),
('/api/v1/rbac/menu/permissions', 'GET', 'rbac.MenuPermissionList'),
('/api/v1/rbac/menu/listAll', 'GET', 'rbac.MenuListExpand'),

('/permissions/groups', 'GET', 'group.List'),
('/permissions/groups', 'POST', 'group.Create'),
('/permissions/groups/:groupId', 'PUT', 'group.Update'),
('/permissions/groups/:groupId', 'DELETE', 'group.Delete'),
('/permissions/groups/all', 'GET', 'group.ListALL'),

('/permissions/actions', 'GET', 'rbac.ActionList'),
('/permissions/actions', 'POST', 'rbac.ActionCreate'),
('/permissions/actions/:id', 'DELETE', 'rbac.ActionDelete'),
('/permissions/actions/:id', 'PUT', 'rbac.ActionUpdate'),

('/permissions/roles', 'GET', 'rbac.RoleList'),
('/permissions/roles', 'POST', 'rbac.RoleCreate'),
('/permissions/roles/:id', 'DELETE', 'rbac.RoleDelete'),
('/permissions/roles/:id', 'PUT', 'rbac.RoleUpdate'),

('/permissions/roles/:roleId/resources', 'GET', 'rbac.RoleResourceList'),
('/permissions/roles/:roleId/resources', 'POST', 'rbac.RoleResourceCreate'),
('/permissions/roles/:roleId/resources/:resourceId', 'DELETE', 'rbac.RoleResourceDelete'),
('/permissions/roles/:roleId/available/resources', 'GET', 'rbac.RoleRelAvailableResourceList'),

('/permissions/roles/:roleId/groups', 'GET', 'rbac.RoleRelGroupList'),
('/permissions/roles/:roleId/groups', 'POST', 'rbac.RoleRelGroupCreate'),
('/permissions/roles/:roleId/groups/:id', 'DELETE', 'rbac.RoleRelGroupDelete'),
('/permissions/roles/:roleId/available/groups', 'GET', 'rbac.RoleRelAvailableGroups'),

('/permissions/roles/:roleId/users', 'GET', 'rbac.RoleRelUserList'),
('/permissions/roles/:roleId/users', 'POST', 'rbac.RoleRelUserCreate'),
('/permissions/roles/:roleId/users/:id', 'DELETE', 'rbac.RoleRelUserDelete'),
('/permissions/roles/:roleId/available/users', 'GET', 'rbac.RoleRelAvailableUsers'),

('/permissions/apiKeys', 'GET', 'rbac.ListAPIKeys'),
('/permissions/apiKeys/:id', 'DELETE', 'rbac.DeleteAPIKey'),
('/permissions/apiKeys', 'POST', 'rbac.CreateAPIKey');


DELETE a
  FROM rbac_api_action a
   JOIN (
    SELECT MIN(id) as id, resource, verb
        FROM rbac_api_action
            GROUP BY resource, verb
                HAVING COUNT(*) > 1
                ) b ON a.id > b.id AND a.resource = b.resource AND a.verb = b.verb;



UPDATE rbac_api_action
SET resource = CONCAT('/api/v1', resource)
WHERE resource NOT LIKE '/api/v1%';
