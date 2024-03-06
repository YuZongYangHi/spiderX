package models

const (
	QueryMenuRoleBindingByUserIdOrGroupId = `SELECT
			t1.id,
			t1.role_id,
			t2.role_binding_id AS user_role_binding_id,
			t2.user_id,
			t3.role_binding_id AS group_role_binding_id 
		FROM
			rbac_menu_role_binding t1
			LEFT JOIN rbac_menu_role_binding_user t2 ON t1.id = t2.role_binding_id
			LEFT JOIN rbac_menu_role_binding_group t3 ON t1.id = t3.role_binding_id 
		WHERE
			t2.user_id = ?
			OR t3.group_id = ?`

	queryResourceExistenceByUserOrGroupRawSQL = ` SELECT
			t1.id,
			t1.role_id,
			t2.role_binding_id AS user_role_binding_id,
			t2.user_id,
			t3.role_binding_id AS group_role_binding_id
		FROM
			rbac_api_role_binding t1
			LEFT JOIN rbac_api_role_binding_user t2 ON t1.id = t2.role_binding_id
			LEFT JOIN rbac_api_role_binding_group t3 ON t1.id = t3.role_binding_id
		WHERE
			t2.user_id = ?
			OR t3.group_id = ?
`
	QueryOnlineServerByTreeIdRawSQL = ` SELECT
			DISTINCT t1.*
		FROM
			server t1
			INNER JOIN tree_resource_mapping t2 ON t2.type = 1 
			AND t2.resource_id = t1.id 
		WHERE
			tree_id = ?
			AND is_deleted = 0 
			AND t1.id IN ?
	`

	QueryOfflineServerByTreeIdRawSQL = ` SELECT
			DISTINCT t1.*
		FROM
			server t1
			INNER JOIN tree_resource_mapping t2 ON t2.type = 1 
			AND t2.resource_id = t1.id 
		WHERE
			tree_id = ?
			AND is_deleted = 1
			AND t1.id IN ?
	`

	QueryRelTreeNodePathServerByTreeIdsSQL = ` SELECT
			DISTINCT t1.*
		FROM
			server t1
			INNER JOIN tree_resource_mapping t2 ON t2.type = 1 
			AND t2.resource_id = t1.id 
		WHERE
			tree_id IN ?
			AND is_deleted = ?
			AND t1.id IN ?
	`

	BatchUpdateTreeNamePathSQL = `UPDATE tree 
		SET full_name_path = REPLACE ( full_name_path, ?, ? ) 
	WHERE
		full_name_path LIKE ?;`

	QueryTicketRecordTodoListRawSQL = `
		SELECT
			t1.* 
		FROM
			ticket_workflow_record t1
			INNER JOIN ticket_workflow_state t2 ON t2.id = t1.state_id 
			AND t2.hidden_state = 1 
			AND ( t2.participant_type = 1 AND FIND_IN_SET(?, t2.participant ) > 0 ) 
			OR ( t2.participant_type = 2 AND FIND_IN_SET(?, t2.participant ) > 0 );`
)
