package models

type apiKeyRelRole struct{}

func (c *apiKeyRelRole) Add(m *APIKeyRelRole) error {
	return db.Create(m).Error
}

func (c *apiKeyRelRole) GetByKeyIdByRoleId(keyId, roleId int64) (APIKeyRelRole, error) {
	var result APIKeyRelRole
	err := db.Where("key_id = ? AND role_id = ?", keyId, roleId).Error
	return result, err
}

func (*apiKeyRelRole) DeleteByKeyId(keyId int64) error {
	return db.Where("key_id = ?", keyId).Delete(&APIKeyRelRole{}).Error
}

func (*apiKeyRelRole) DeleteByRoleId(roleId int64) error {
	return db.Where("role_id = ?", roleId).Delete(&APIKeyRelRole{}).Error
}
