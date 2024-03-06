package models

type rbacAPIRoleResourceModel struct{}

func (*rbacAPIRoleResourceModel) GetByRoleIdByResourceId(roleId, resourceId int64) (action APIRoleRelAction, err error) {
	err = db.Where("role_id = ? AND action_id = ?", roleId, resourceId).First(&action).Error
	return
}

func (c *rbacAPIRoleResourceModel) Add(m *APIRoleRelAction) error {
	return db.Create(m).Error
}

func (c *rbacAPIRoleResourceModel) DeleteByRoleIdByResourceId(roleId, resourceId int64) error {
	return db.Where("role_id = ? AND action_id = ?", roleId, resourceId).Delete(&APIRoleRelAction{}).Error
}

func (c *rbacAPIRoleResourceModel) Update(m *APIRoleRelAction) error {
	return db.Save(m).Error
}

func (c *rbacAPIRoleResourceModel) ListByRoleId(roleId int64) (result []APIRoleRelAction, err error) {
	err = db.Where("role_id = ?", roleId).Find(&result).Error
	return
}

func (c *rbacAPIRoleResourceModel) DeleteByRoleId(id int64) error {
	return db.Where("role_id = ?", id).Delete(&APIRoleRelAction{}).Error
}

func (c *rbacAPIRoleResourceModel) DeleteByActionId(id int64) error {
	return db.Where("action_id = ?", id).Delete(&APIRoleRelAction{}).Error
}
