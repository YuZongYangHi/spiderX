package router

import (
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/analysis"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/assets/ip"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/assets/ip_range"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/assets/net_device"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/assets/node"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/assets/server"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/audit"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/base"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/duty_roster"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/group"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/idc"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/permissions/menu"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/rbac"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/ticket"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/tree"
	"github.com/YuZongYangHi/spiderX/spider-api/internal/app/apiserver/controllers/user"
	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Router struct {
	ctx *echo.Echo
}

func (c *Router) Register(ctx *echo.Echo) {
	{
		ctx.Use(ContextExtenderMiddleware)
		ctx.Use(middleware.Secure())
		ctx.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(1000)))
		ctx.Use(middleware.RequestLoggerWithConfig(RequestLoggerMiddleware()))
		ctx.Use(BlacklistMiddleware)
		ctx.Use(AuthenticationMiddleware)
		ctx.Use(PermissionsMiddleWare)
		ctx.Use(echoprometheus.NewMiddleware("myapp"))
	}

	c.ctx.GET("/metrics", echoprometheus.NewHandler())
	c.ctx.GET("/health", func(c echo.Context) error {
		return c.JSON(200, "OK")
	})

	apiGroup := c.ctx.Group("/api/v1")

	{
		summaryGroup := apiGroup.Group("/summary")
		summaryGroup.GET("/machine", base.HandleFunc(analysis.MachineSummary))
		summaryGroup.GET("/netDevice", base.HandleFunc(analysis.NetDeviceSummary))
		summaryGroup.GET("/idc", base.HandleFunc(analysis.IdcSummary))
		summaryGroup.GET("/ticket", base.HandleFunc(analysis.TicketTrendSummary))
	}

	{
		userGroup := apiGroup.Group("/users")
		userGroup.POST("/login", user.Login)
		userGroup.GET("/logout", user.Logout)
		userGroup.GET("/currentUser", user.CurrentUserInfo)
	}

	{
		// rbac menu list
		permissionsGroup := apiGroup.Group("/permissions")
		permissionsGroup.GET("/menu", menu.List)
		permissionsGroup.POST("/menu", menu.Create)
		permissionsGroup.DELETE("/menu/:id", menu.Delete)
		permissionsGroup.PUT("/menu/:id", menu.Update)

		// rbac menu role manager
		permissionsGroup.POST("/menu/role", menu.RoleCreate)
		permissionsGroup.DELETE("/menu/role/:id", menu.RoleDelete)
		permissionsGroup.PUT("/menu/role/:id", menu.RoleUpdate)
		permissionsGroup.GET("/menu/role", menu.RoleList)

		// rbac menu grant group
		permissionsGroup.GET("/menu/:id/grant/group", menu.GroupPermissionsList)
		permissionsGroup.DELETE("/menu/:menuId/grant/group/:permissionId", menu.GroupPermissionsDelete)
		permissionsGroup.PUT("/menu/:menuId/grant/group/:permissionId", menu.GroupPermissionsUpdate)
		permissionsGroup.POST("/menu/:menuId/grant/group", menu.GroupPermissionsCreate)

		// rbac menu grant user
		permissionsGroup.POST("/menu/:menuId/grant/user", menu.UserPermissionsCreate)
		permissionsGroup.GET("/menu/:id/grant/user", menu.UserPermissionsList)
		permissionsGroup.DELETE("/menu/:menuId/grant/user/:permissionId", menu.UserPermissionsDelete)
		permissionsGroup.PUT("/menu/:menuId/grant/user/:permissionId", menu.UserPermissionsUpdate)
		permissionsGroup.GET("/menu/:id/users", menu.UserList)
		permissionsGroup.GET("/menu/:id/groups", menu.GroupList)

		// rbac menu role resource grant
		permissionsGroup.GET("/menu/role/:roleId/resource", menu.RoleResourceList)
		permissionsGroup.POST("/menu/role/:roleId/resource", menu.RoleResourceCreate)
		permissionsGroup.DELETE("/menu/role/:roleId/resource/:resourceId", menu.RoleResourceDelete)
		permissionsGroup.GET("/menu/role/:roleId/resource/menus", menu.RoleResourceMenuList)

		// rbac menu role resource role grant
		permissionsGroup.GET("/menu/role/:roleId/allocation/group", menu.RoleAllocationGroupList)
		permissionsGroup.DELETE("/menu/role/:roleId/allocation/group/:id", menu.RoleAllocationGroupDelete)
		permissionsGroup.POST("/menu/role/:roleId/allocation/group", menu.RoleAllocationGroupCreate)
		permissionsGroup.GET("/menu/role/:roleId/allocation/group/available", menu.RoleAllocationAvailableGroup)

		permissionsGroup.GET("/menu/role/:roleId/allocation/user", menu.RoleAllocationUserList)
		permissionsGroup.DELETE("/menu/role/:roleId/allocation/user/:id", menu.RoleAllocationUserDelete)
		permissionsGroup.POST("/menu/role/:roleId/allocation/user", menu.RoleAllocationUserCreate)
		permissionsGroup.GET("/menu/role/:roleId/allocation/user/available", menu.RoleAllocationAvailableUser)

		// user
		permissionsGroup.GET("/users", user.List)
		permissionsGroup.POST("/users", user.Create)
		permissionsGroup.PUT("/users/:userId", user.Update)
		permissionsGroup.DELETE("/users/:userId", user.Delete)

		// group
		permissionsGroup.GET("/groups", group.List)
		permissionsGroup.POST("/groups", group.Create)
		permissionsGroup.PUT("/groups/:groupId", group.Update)
		permissionsGroup.DELETE("/groups/:groupId", group.Delete)
		permissionsGroup.GET("/groups/all", group.ListALL)

		// resource
		permissionsGroup.GET("/actions", rbac.ActionList)
		permissionsGroup.POST("/actions", rbac.ActionCreate)
		permissionsGroup.DELETE("/actions/:id", rbac.ActionDelete)
		permissionsGroup.PUT("/actions/:id", rbac.ActionUpdate)

		// role
		permissionsGroup.GET("/roles", rbac.RoleList)
		permissionsGroup.POST("/roles", rbac.RoleCreate)
		permissionsGroup.DELETE("/roles/:id", rbac.RoleDelete)
		permissionsGroup.PUT("/roles/:id", rbac.RoleUpdate)

		// role resources
		permissionsGroup.GET("/roles/:roleId/resources", rbac.RoleResourceList)
		permissionsGroup.POST("/roles/:roleId/resources", rbac.RoleResourceCreate)
		permissionsGroup.DELETE("/roles/:roleId/resources/:resourceId", rbac.RoleResourceDelete)
		permissionsGroup.GET("/roles/:roleId/available/resources", rbac.RoleRelAvailableResourceList)

		// role rel groups
		permissionsGroup.GET("/roles/:roleId/groups", rbac.RoleRelGroupList)
		permissionsGroup.POST("/roles/:roleId/groups", rbac.RoleRelGroupCreate)
		permissionsGroup.DELETE("/roles/:roleId/groups/:id", rbac.RoleRelGroupDelete)
		permissionsGroup.GET("/roles/:roleId/available/groups", rbac.RoleRelAvailableGroups)

		// role rel users
		permissionsGroup.GET("/roles/:roleId/users", rbac.RoleRelUserList)
		permissionsGroup.POST("/roles/:roleId/users", rbac.RoleRelUserCreate)
		permissionsGroup.DELETE("/roles/:roleId/users/:id", rbac.RoleRelUserDelete)
		permissionsGroup.GET("/roles/:roleId/available/users", rbac.RoleRelAvailableUsers)

		// API key
		permissionsGroup.GET("/apiKeys", rbac.ListAPIKeys)
		permissionsGroup.DELETE("/apiKeys/:id", rbac.DeleteAPIKey)
		permissionsGroup.POST("/apiKeys", rbac.CreateAPIKey)
	}

	{
		rbacGroup := apiGroup.Group("/rbac")
		rbacGroup.GET("/menu/list", rbac.MenuList)
		rbacGroup.GET("/menu/permissions", rbac.MenuPermissionList)
		rbacGroup.GET("/menu/listAll", rbac.MenuListExpand)
	}

	{
		assetsGroup := apiGroup.Group("/assets")
		assetsGroup.GET("/tree", tree.List)
		assetsGroup.POST("/tree/delete", tree.Delete)
		assetsGroup.POST("/tree/create", tree.Create)
		assetsGroup.POST("/tree/migrate", tree.Migrate)
		assetsGroup.PUT("/tree/:id", tree.Update)

		assetsGroup.GET("/node", node.List)
		assetsGroup.POST("/node", node.Create)
		assetsGroup.GET("/node/:id", node.Detail)
		assetsGroup.PUT("/node/:id", node.Update)
		assetsGroup.DELETE("/node/:id", node.Delete)
		assetsGroup.PUT("/node/:id/status", node.UpdateStatus)
		assetsGroup.POST("/node/multiDelete", node.MultiDelete)
		assetsGroup.POST("/node/multiUpload", node.MultiUpload)

		assetsGroup.GET("/server/tag", server.TagList)
		assetsGroup.GET("/server/tag/:id", server.TagRetrieve)
		assetsGroup.PUT("/server/tag/:id", server.TagUpdate)
		assetsGroup.DELETE("/server/tag/:id", server.TagDestroy)
		assetsGroup.POST("/server/tag", base.HandleFunc(server.TagCreate))

		assetsGroup.GET("/server", server.List)
		assetsGroup.GET("/server/:id", server.Retrieve)
		assetsGroup.PUT("/server/:id", server.Update)
		assetsGroup.DELETE("/server/:id", server.Destroy)
		assetsGroup.POST("/server", base.HandleFunc(server.Create))
		assetsGroup.POST("/server/multiDelete", server.BatchDelete)
		assetsGroup.POST("/server/:treeId/multiUpload", server.BatchImport)
		assetsGroup.GET("/tree/:treeId/server", server.ListByTreeId)
		assetsGroup.POST("/server/tree/migrate", server.TreeMigrate)

		assetsGroup.GET("/ipRange", ip_range.List)
		assetsGroup.POST("/ipRange", base.HandleFunc(ip_range.Create))
		assetsGroup.GET("/ipRange/:id", ip_range.Retrieve)
		assetsGroup.PUT("/ipRange/:id", ip_range.Update)
		assetsGroup.DELETE("/ipRange/:id", ip_range.Delete)

		assetsGroup.GET("/ip", base.HandleFunc(ip.List))
		assetsGroup.POST("/ip", base.HandleFunc(ip.Create))
		assetsGroup.GET("/ip/:id", ip.Retrieve)
		assetsGroup.PUT("/ip/:id", ip.Update)
		assetsGroup.DELETE("/ip/:id", ip.Delete)

		assetsGroup.GET("/switch", net_device.SwitchList)
		assetsGroup.POST("/switch", base.HandleFunc(net_device.SwitchCreate))
		assetsGroup.GET("/switch/:id", net_device.SwitchRetrieve)
		assetsGroup.PUT("/switch/:id", net_device.SwitchUpdate)
		assetsGroup.DELETE("/switch/:id", net_device.SwitchDelete)

		assetsGroup.GET("/router", net_device.RouterList)
		assetsGroup.POST("/router", base.HandleFunc(net_device.RouterCreate))
		assetsGroup.GET("/router/:id", net_device.RouterRetrieve)
		assetsGroup.PUT("/router/:id", net_device.RouterUpdate)
		assetsGroup.DELETE("/router/:id", net_device.RouterDelete)
	}

	{
		auditGroup := apiGroup.Group("/audit")
		auditGroup.GET("/:id/operateLog", audit.OperateLog)
		auditGroup.GET("/operate", audit.OperateLogList)
		auditGroup.GET("/login", audit.UserLoginList)
	}

	{
		idcGroup := apiGroup.Group("/idc")
		idcGroup.GET("/provider", idc.ProviderList)
		idcGroup.GET("/provider/:id", idc.ProviderRetrieve)
		idcGroup.PUT("/provider/:id", idc.ProviderUpdate)
		idcGroup.DELETE("/provider/:id", idc.ProviderDestroy)
		idcGroup.POST("/provider", base.HandleFunc(idc.ProviderCreate))

		idcGroup.GET("/factory", idc.FactoryList)
		idcGroup.GET("/factory/:id", idc.FactoryRetrieve)
		idcGroup.PUT("/factory/:id", idc.FactoryUpdate)
		idcGroup.DELETE("/factory/:id", idc.FactoryDestroy)
		idcGroup.POST("/factory", base.HandleFunc(idc.FactoryCreate))

		idcGroup.GET("/suit", idc.SuitList)
		idcGroup.GET("/suit/:id", idc.SuitRetrieve)
		idcGroup.PUT("/suit/:id", idc.SuitUpdate)
		idcGroup.DELETE("/suit/:id", idc.SuitDestroy)
		idcGroup.POST("/suit", base.HandleFunc(idc.SuitCreate))

		idcGroup.GET("/suit/type", idc.SuitTypeList)
		idcGroup.GET("/suit/type/:id", idc.SuitTypeRetrieve)
		idcGroup.PUT("/suit/type/:id", idc.SuitTypeUpdate)
		idcGroup.DELETE("/suit/type/:id", idc.SuitTypeDestroy)
		idcGroup.POST("/suit/type", base.HandleFunc(idc.SuitTypeCreate))

		idcGroup.GET("/suit/season", idc.SuitSeasonList)
		idcGroup.GET("/suit/season/:id", idc.SuitSeasonRetrieve)
		idcGroup.PUT("/suit/season/:id", idc.SuitSeasonUpdate)
		idcGroup.DELETE("/suit/season/:id", idc.SuitSeasonDestroy)
		idcGroup.POST("/suit/season", base.HandleFunc(idc.SuitSeasonCreate))

		idcGroup.GET("/az", idc.AzList)
		idcGroup.GET("/az/:id", idc.AzRetrieve)
		idcGroup.PUT("/az/:id", idc.AzUpdate)
		idcGroup.DELETE("/az/:id", idc.AzDestroy)
		idcGroup.POST("/az", base.HandleFunc(idc.AzCreate))
		idcGroup.POST("/az/multiDelete", idc.AzMultiDelete)
		idcGroup.POST("/az/multiImport", idc.AzMultiImport)

		idcGroup.GET("/idc", idc.IdcList)
		idcGroup.GET("/idc/:id", idc.IdcRetrieve)
		idcGroup.PUT("/idc/:id", idc.IdcUpdate)
		idcGroup.DELETE("/idc/:id", idc.IdcDestroy)
		idcGroup.POST("/idc", base.HandleFunc(idc.IdcCreate))

		idcGroup.GET("/room", idc.IdcRoomList)
		idcGroup.GET("/room/:id", idc.IdcRoomRetrieve)
		idcGroup.PUT("/room/:id", idc.IdcRoomUpdate)
		idcGroup.DELETE("/room/:id", idc.IdcRoomDestroy)
		idcGroup.POST("/room", base.HandleFunc(idc.IdcRoomCreate))

		idcGroup.GET("/rack", idc.IdcRackList)
		idcGroup.GET("/rack/:id", idc.IdcRackRetrieve)
		idcGroup.PUT("/rack/:id", idc.IdcRackUpdate)
		idcGroup.DELETE("/rack/:id", idc.IdcRackDestroy)
		idcGroup.POST("/rack", base.HandleFunc(idc.IdcRackCreate))

		idcGroup.GET("/rack/slot", idc.RackSlotList)
		idcGroup.GET("/rack//slot/:id", idc.RackSlotRetrieve)
		idcGroup.PUT("/rack/slot/:id", idc.RackSlotUpdate)
		idcGroup.DELETE("/rack/slot/:id", idc.RackSlotDestroy)
		idcGroup.POST("/rack/slot", base.HandleFunc(idc.RackSlotCreate))
		idcGroup.GET("/rack/slot/queryFullName", idc.QueryRackSlot)
	}

	{
		ticketEngineGroup := apiGroup.Group("/ticket/engine")
		ticketEngineGroup.GET("/product", base.HandleFunc(ticket.ListEngineProduct))
		ticketEngineGroup.DELETE("/product/:id", base.HandleFunc(ticket.DestroyEngineProduct))
		ticketEngineGroup.PUT("/product/:id", base.HandleFunc(ticket.UpdateEngineProduct))
		ticketEngineGroup.GET("/product/:id", base.HandleFunc(ticket.RetrieveEngineProduct))
		ticketEngineGroup.POST("/product", base.HandleFunc(ticket.CreateEngineProduct))
		ticketEngineGroup.GET("/product/:id/category", base.HandleFunc(ticket.ListEngineProductCategory))

		ticketEngineGroup.GET("/category", base.HandleFunc(ticket.ListEngineCategory))
		ticketEngineGroup.DELETE("/category/:id", base.HandleFunc(ticket.DestroyEngineCategory))
		ticketEngineGroup.PUT("/category/:id", base.HandleFunc(ticket.UpdateEngineCategory))
		ticketEngineGroup.GET("/category/:id", base.HandleFunc(ticket.RetrieveEngineCategory))
		ticketEngineGroup.POST("/category", base.HandleFunc(ticket.CreateEngineCategory))
		ticketEngineGroup.GET("/category/:categoryId/document", base.HandleFunc(ticket.ListEngineCategoryDocumentByCategoryId))
		ticketEngineGroup.GET("/category/:categoryId/state", base.HandleFunc(ticket.ListNodeStateByWorkflowId))
		ticketEngineGroup.GET("/category/:categoryId/transition", base.HandleFunc(ticket.ListNodeStateTransitionByWorkflowId))
		ticketEngineGroup.GET("/category/:categoryId/customForm", base.HandleFunc(ticket.ListWorkflowCustomFormByWorkflowId))

		ticketEngineGroup.GET("/category/document", base.HandleFunc(ticket.ListEngineCategoryDocument))
		ticketEngineGroup.DELETE("/category/document/:id", base.HandleFunc(ticket.DestroyEngineCategoryDocument))
		ticketEngineGroup.PUT("/category/document/:id", base.HandleFunc(ticket.UpdateEngineCategoryDocument))
		ticketEngineGroup.GET("/category/document/:id", base.HandleFunc(ticket.RetrieveEngineCategoryDocument))
		ticketEngineGroup.POST("/category/document", base.HandleFunc(ticket.CreateEngineCategoryDocument))

		ticketEngineGroup.GET("/workflow/state", base.HandleFunc(ticket.ListNodeState))
		ticketEngineGroup.DELETE("/workflow/state/:id", base.HandleFunc(ticket.DestroyWorkflowNodeState))
		ticketEngineGroup.PUT("/workflow/state/:id", base.HandleFunc(ticket.UpdateWorkflowNodeState))
		ticketEngineGroup.GET("/workflow/state/:id", base.HandleFunc(ticket.RetrieveWorkflowNodeState))
		ticketEngineGroup.POST("/workflow/state", base.HandleFunc(ticket.CreateWorkflowNodeState))

		ticketEngineGroup.GET("/workflow/transition", base.HandleFunc(ticket.ListNodeStateTransition))
		ticketEngineGroup.DELETE("/workflow/transition/:id", base.HandleFunc(ticket.DestroyWorkflowNodeStateTransition))
		ticketEngineGroup.PUT("/workflow/transition/:id", base.HandleFunc(ticket.UpdateWorkflowNodeStateTransition))
		ticketEngineGroup.GET("/workflow/transition/:id", base.HandleFunc(ticket.RetrieveWorkflowNodeStateTransition))
		ticketEngineGroup.POST("/workflow/transition", base.HandleFunc(ticket.CreateWorkflowNodeStateTransition))

		ticketEngineGroup.GET("/workflow/customForm", base.HandleFunc(ticket.ListWorkflowCustomForm))
		ticketEngineGroup.DELETE("/workflow/customForm/:id", base.HandleFunc(ticket.DestroyWorkflowCustomForm))
		ticketEngineGroup.PUT("/workflow/customForm/:id", base.HandleFunc(ticket.UpdateWorkflowCustomForm))
		ticketEngineGroup.GET("/workflow/customForm/:id", base.HandleFunc(ticket.RetrieveWorkflowCustomForm))
		ticketEngineGroup.POST("/workflow/customForm", base.HandleFunc(ticket.CreateWorkflowCustomForm))
	}

	{
		ticketGroup := apiGroup.Group("/ticket")
		ticketGroup.GET("/product", base.HandleFunc(ticket.ListProduct))
		ticketGroup.GET("/product/:productId/category", base.HandleFunc(ticket.ListCategory))
		ticketGroup.GET("/category/:categoryId/document", base.HandleFunc(ticket.ListDocument))
		ticketGroup.GET("/category/:categoryId/customForm", base.HandleFunc(ticket.ListCustomForm))
		ticketGroup.POST("/category/:categoryId/record", base.HandleFunc(ticket.CreateTicketRecord))
		ticketGroup.PUT("/category/:categoryId/record/:sn", base.HandleFunc(ticket.UpdateTicketRecord))
		ticketGroup.GET("/record/todo/list", base.HandleFunc(ticket.ListTicketTodoRecord))
		ticketGroup.GET("/record/done/list", base.HandleFunc(ticket.ListTicketDoneRecord))
		ticketGroup.GET("/record/apply/list", base.HandleFunc(ticket.ListTicketApplyRecord))
		ticketGroup.DELETE("/record/:id", base.HandleFunc(ticket.DestroyRecord))
		ticketGroup.PUT("/record/:sn/discard", base.HandleFunc(ticket.RecordDiscard))

		{
			ticketGroup.GET("/record/:id/flowLogs", base.HandleFunc(ticket.ListRecordFlowLog))
			ticketGroup.GET("/record/:sn/transition", base.HandleFunc(ticket.ListProcessButtonTransition))
			ticketGroup.GET("/record/:sn/form", base.HandleFunc(ticket.ListProcessForm))
			ticketGroup.GET("/record/:sn", base.HandleFunc(ticket.RetrieveRecord))
			ticketGroup.GET("/record/:sn/hasPermissions", base.HandleFunc(ticket.CheckUserHasRecordLookPermissions))
			ticketGroup.GET("/record/:sn/nodeState/list", base.HandleFunc(ticket.ListNodeByRecordSn))
			ticketGroup.GET("/record/:sn/:nodeId/urge", base.HandleFunc(ticket.GetRecordNodeStateUrge))
			ticketGroup.PUT("/record/:sn/:nodeId/urge", base.HandleFunc(ticket.SendRecordNodeStateUrge))
			ticketGroup.GET("/record/:sn/comment", base.HandleFunc(ticket.ListRecordComment))
			ticketGroup.POST("/record/:sn/comment", base.HandleFunc(ticket.AddRecordComment))

		}
		{
			ticketFormRemoteSearchGroup := ticketGroup.Group("/formRemoteSearch")
			ticketFormRemoteSearchGroup.GET("/userList", base.HandleFunc(ticket.FormRemoteSearchUserList))
		}
	}

	{
		dutyRosterGroup := apiGroup.Group("/oncall")
		dutyRosterGroup.GET("/list", base.HandleFunc(duty_roster.ListOnCall))
		dutyRosterGroup.POST("/exchange", base.HandleFunc(duty_roster.Exchange))
		dutyRosterGroup.GET("/drawLots", base.HandleFunc(duty_roster.ListDrawLots))
		dutyRosterGroup.POST("/drawLots", base.HandleFunc(duty_roster.CreateDrawLots))
		dutyRosterGroup.DELETE("/drawLots/:id", base.HandleFunc(duty_roster.DestroyDrawLots))
		dutyRosterGroup.PUT("/drawLots/:id", base.HandleFunc(duty_roster.UpdateDrawLots))
	}

}

func NewRouter(e *echo.Echo) *Router {
	return &Router{e}
}
