package models

var (
	RequestWhitelistModel *requestWhitelistModel
	RequestBlacklistModel *blacklistModel
	UserModel             *userModel
	GroupModel            *groupModel

	MenuModel                     *rbacMenuModel
	RBACMenuRoleBindingModel      *menuRoleBindingModel
	RBACMenuRoleModel             *menuRoleModel
	RBACMenuPermissionsGroupModel *menuPermissionGroupModel
	RBACMenuPermissionsUserModel  *menuPermissionsUserModel
	RBACMenuPermissionModel       *menuPermissionModel
	RBACMenuRoleBindingMenuModel  *menuRoleBindingMenuModel
	RBACMenuRoleBindingUserModel  *menuRoleBindingUserModel
	RBACMenuRoleBindingGroupModel *menuRoleBindingGroupModel
	RBACAPIActionModel            *rbacAPIActionModel
	RBACAPIRoleModel              *rbacAPIRoleModel
	RBACAPIRoleBindingModel       *rbacAPIRoleBindingModel
	RBACAPIRoleBindingUserModel   *rbacAPIRoleBindingUserModel
	RBACAPIRoleBindingGroupModel  *rbacAPIRoleBindingGroupModel
	RBACAPIRoleRelResourceModel   *rbacAPIRoleResourceModel

	APIKeyModel        *apiKeyModel
	APIKeyRelRoleModel *apiKeyRelRole

	TreeModel       *treeModel
	NodeModel       *nodeModel
	OperateLogModel *operateLogModel

	ServerModel *serverModel

	IdcRackSlotModel *idcRackSlotModel
	FactoryModel     *factoryModel
	ProviderMode     *providerModel
	SuitModel        *suitModel

	NetIpModel  *netIpModel
	TicketModel *ticketModel
	OnCallModel *onCallModel
)

func init() {
	RequestWhitelistModel = &requestWhitelistModel{}
	RequestBlacklistModel = &blacklistModel{}
	UserModel = &userModel{}
	MenuModel = &rbacMenuModel{}
	RBACMenuRoleBindingModel = &menuRoleBindingModel{}
	RBACMenuRoleModel = &menuRoleModel{}

	RBACMenuPermissionsGroupModel = &menuPermissionGroupModel{}
	RBACMenuPermissionsUserModel = &menuPermissionsUserModel{}
	RBACMenuPermissionModel = &menuPermissionModel{}
	GroupModel = &groupModel{}
	RBACMenuRoleBindingMenuModel = &menuRoleBindingMenuModel{}

	RBACMenuRoleBindingUserModel = &menuRoleBindingUserModel{}
	RBACMenuRoleBindingGroupModel = &menuRoleBindingGroupModel{}

	RBACAPIActionModel = &rbacAPIActionModel{}
	RBACAPIRoleModel = &rbacAPIRoleModel{}
	RBACAPIRoleBindingModel = &rbacAPIRoleBindingModel{}
	RBACAPIRoleBindingUserModel = &rbacAPIRoleBindingUserModel{}
	RBACAPIRoleBindingGroupModel = &rbacAPIRoleBindingGroupModel{}
	RBACAPIRoleRelResourceModel = &rbacAPIRoleResourceModel{}

	APIKeyModel = &apiKeyModel{}
	APIKeyRelRoleModel = &apiKeyRelRole{}

	TreeModel = &treeModel{}
	NodeModel = &nodeModel{}

	OperateLogModel = &operateLogModel{}
	ServerModel = &serverModel{}

	IdcRackSlotModel = &idcRackSlotModel{}
	FactoryModel = &factoryModel{}
	ProviderMode = &providerModel{}
	SuitModel = &suitModel{}
	NetIpModel = &netIpModel{}

	TicketModel = &ticketModel{}
	OnCallModel = &onCallModel{}
}
