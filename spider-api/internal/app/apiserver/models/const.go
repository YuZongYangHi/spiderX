package models

const (
	TableNameRequestWhitelist            = "request_whitelist"
	TableNameRequestBlacklist            = "request_blacklist"
	TableNameUser                        = "user"
	TableNameGroup                       = "group"
	TableNameRBACMenu                    = "rbac_menu"
	TableNameRBACMenuRole                = "rbac_menu_role"
	TableNameRBACMenuRoleBinding         = "rbac_menu_role_binding"
	TableNameRBACMenuRoleBindingUser     = "rbac_menu_role_binding_user"
	TableNameRBACMenuRoleBindingGroup    = "rbac_menu_role_binding_group"
	TableNameRBACMenuRoleBindingMenu     = "rbac_menu_role_binding_menu"
	TableNameRBACMenuRolePermissionUser  = "rbac_menu_permissions_user"
	TableNameRBACMenuRolePermissionGroup = "rbac_menu_permissions_group"
	TableNameRBACAPIAction               = "rbac_api_action"
	TableNameRBACAPIRole                 = "rbac_api_role"
	TableNameRBACAPIRoleRlAction         = "rbac_api_role_actions"
	TableNameRBACAPIRoleBinding          = "rbac_api_role_binding"
	TableNameRBACAPIRoleBindingRelUser   = "rbac_api_role_binding_user"
	TableNameRBACAPIRoleBindingRelGroup  = "rbac_api_role_binding_group"
	TableNameRBACAPIKey                  = "rbac_api_key"
	TableNameRBACAPIKeyRelRole           = "rbac_api_key_roles"
	TableNameTree                        = "tree"
	TableNameNode                        = "node"
	TableNameTreeResourceMapping         = "tree_resource_mapping"
	TableNameOperateLog                  = "operate_log"
	TableNameSuit                        = "server_suit"
	TableNameSuitType                    = "server_suit_type"
	TableNameSuitSeason                  = "server_suit_season"
	TableNameProvider                    = "server_provider"
	TableNameFactory                     = "server_factory"
	TableNameIdcRackSlot                 = "idc_rack_slot"
	TableNameIdcRack                     = "idc_rack"
	TableNameIdcRoom                     = "idc_room"
	TableNameIdc                         = "idc"
	TableNameAz                          = "az"
	TableNameServerTag                   = "server_tag"
	TableNameServerRelTag                = "server_rel_tag"
	TableNameServer                      = "server"
	TableNameServerIp                    = "server_ip"
	TableNameServerIpRelResource         = "server_rel_ip"
	TableNameServerIpRange               = "server_ip_range"
	TableNameAuditLogin                  = "audit_login"
	TableNameNetSwitch                   = "net_switch"
	TableNameNetRouter                   = "net_router"

	TableNameTicketCategory                = "ticket_category"
	TableNameTicketProduct                 = "ticket_product"
	TableNameTicketCategoryDocument        = "ticket_category_document"
	TableNameTicketWorkflowState           = "ticket_workflow_state"
	TableNameTicketWorkflowTransition      = "ticket_workflow_transition"
	TableNameTicketWorkflowRecord          = "ticket_workflow_record"
	TableNameTicketWorkflowFlowLog         = "ticket_workflow_flow_log"
	TableNameTicketWorkflowRecordComment   = "ticket_workflow_record_comment"
	TableNameTicketWorkflowCustomFormField = "ticket_workflow_custom_form_field"
	TableNameTicketWorkflowRecordFormField = "ticket_workflow_record_form_field"
	TableNameTicketRecordNodeUrge          = "ticket_record_node_urge"

	TableNameDutyLottery  = "duty_lottery"
	TableNameDutyExchange = "duty_exchange"
	TableNameDutyRoster   = "duty_roster"
)

var (
	ActionVerbs = map[string]string{
		"POST":   "POST",
		"DELETE": "DELETE",
		"PUT":    "PUT",
		"GET":    "GET",
	}
)
