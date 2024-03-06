package base

var (
	ProviderFieldFilterCondition = []SerializersField{
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		}, {
			Field: "alias",
			Type:  LikeExpressionEnum,
		},
		{
			Field: "creator",
			Type:  LikeExpressionEnum,
		},
	}
	FactoryFieldFilterCondition = []SerializersField{
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		}, {
			Field:  "modeName",
			Type:   LikeExpressionEnum,
			Column: "mode_name",
		},
		{
			Field:  "enName",
			Type:   LikeExpressionEnum,
			Column: "en_name",
		},
		{
			Field:  "cnName",
			Type:   LikeExpressionEnum,
			Column: "cn_name",
		},
	}
	SuitFieldFilterCondition = []SerializersField{
		{
			Field: "season",
			Type:  LikeExpressionEnum,
		}, {
			Field: "type",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		},
	}
	SuitNameFilterCondition = []SerializersField{
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		},
	}
	AzFieldFilterCondition = []SerializersField{
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		}, {
			Field:  "cnName",
			Type:   LikeExpressionEnum,
			Column: "cn_name",
		},
		{
			Field: "region",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "province",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "type",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "status",
			Type:  EqualExpressionEnum,
		}, {
			Field:  "multiSearchName",
			Type:   ContainsExpressionEnum,
			Column: "name",
		}, {
			Field:  "multiSearchCnName",
			Type:   ContainsExpressionEnum,
			Column: "cn_name",
		},
	}
	IdcFieldFilterCondition = []SerializersField{
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		}, {
			Field:  "cnName",
			Type:   LikeExpressionEnum,
			Column: "cn_name",
		},
		{
			Field: "status",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "address",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "region",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "city",
			Type:  EqualExpressionEnum,
		},
		{
			Field:  "idcPhone",
			Type:   LikeExpressionEnum,
			Column: "idc_phone",
		},
		{
			Field:  "idcMail",
			Type:   LikeExpressionEnum,
			Column: "idc_mail",
		},
		{
			Field:  "virtualAzId",
			Type:   EqualExpressionEnum,
			Column: "virtual_az_id",
		},
		{
			Field:  "physicsAzId",
			Type:   EqualExpressionEnum,
			Column: "physics_az_id",
		},
	}
	IdcRoomFilterCondition = []SerializersField{
		{
			Field:  "roomName",
			Type:   LikeExpressionEnum,
			Column: "room_name",
		},
		{
			Field:  "idcId",
			Type:   EqualExpressionEnum,
			Column: "idc_id",
		},
		{
			Field:  "pduStandard",
			Type:   EqualExpressionEnum,
			Column: "pdu_standard",
		},
		{
			Field:  "powerMode",
			Type:   EqualExpressionEnum,
			Column: "power_mode",
		},
		{
			Field:  "rackSize",
			Type:   EqualExpressionEnum,
			Column: "rack_size",
		},
		{
			Field:  "bearerType",
			Type:   EqualExpressionEnum,
			Column: "bearer_type",
		},
		{
			Field:  "bearWeight",
			Type:   EqualExpressionEnum,
			Column: "bear_weight",
		},
		{
			Field: "status",
			Type:  EqualExpressionEnum,
		},
	}

	IdcRackFilterCondition = []SerializersField{
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		},
		{
			Field:  "idcRoomId",
			Type:   EqualExpressionEnum,
			Column: "idc_room_id",
		},
		{
			Field: "status",
			Type:  EqualExpressionEnum,
		},
	}
	IdcRackSlotFilterCondition = []SerializersField{
		{
			Field:  "idcRackId",
			Type:   EqualExpressionEnum,
			Column: "idc_rack_id",
		},
		{
			Field: "type",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "status",
			Type:  EqualExpressionEnum,
		},
	}
	AuditOperateFilterCondition = []SerializersField{
		{
			Field: "username",
			Type:  LikeExpressionEnum,
		},
		{
			Field: "type",
			Type:  EqualExpressionEnum,
		},
		{
			Field:  "resourceName",
			Type:   LikeExpressionEnum,
			Column: "resource_name",
		},
	}
	AuditUserLoginFilterCondition = []SerializersField{
		{
			Field: "username",
			Type:  LikeExpressionEnum,
		},
		{
			Field: "type",
			Type:  EqualExpressionEnum,
		},
	}

	ServerFilterCondition = []SerializersField{
		{
			Field: "sn",
			Type:  LikeExpressionEnum,
		},
		{
			Field: "hostname",
			Type:  LikeExpressionEnum,
		},
		{
			Field: "type",
			Type:  ContainsExpressionEnum,
		},
		{
			Field:  "suitId",
			Type:   EqualExpressionEnum,
			Column: "suit_id",
		},
		{
			Field: "role",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "operator",
			Type:  EqualExpressionEnum,
		},
		{
			Field:  "providerId",
			Type:   EqualExpressionEnum,
			Column: "provider_id",
		},
		{
			Field:  "factoryId",
			Type:   EqualExpressionEnum,
			Column: "factory_id",
		},
		{
			Field:  "nodeId",
			Type:   EqualExpressionEnum,
			Column: "node_id",
		},
		{
			Field:  "idcRackSlotId",
			Type:   EqualExpressionEnum,
			Column: "idc_rack_slot_id",
		},
		{
			Field: "status",
			Type:  EqualExpressionEnum,
		},
		{
			Field:  "appEnv",
			Type:   EqualExpressionEnum,
			Column: "app_env",
		},
		{
			Field:  "privNetIp",
			Type:   LikeExpressionEnum,
			Column: "priv_net_ip",
		},
		{
			Field:  "pubNetIp",
			Type:   LikeExpressionEnum,
			Column: "pub_net_ip",
		},
		{
			Field:  "mgmtPortIp",
			Type:   LikeExpressionEnum,
			Column: "mgmt_port_ip",
		},
		{
			Field: "creator",
			Type:  LikeExpressionEnum,
		},
		{
			Field:  "isDeleted",
			Type:   EqualExpressionEnum,
			Column: "is_deleted",
		},
		{
			Field:  "multiSearchFieldSn",
			Type:   ContainsExpressionEnum,
			Column: "sn",
		},
		{
			Field:  "multiSearchFieldHostname",
			Type:   ContainsExpressionEnum,
			Column: "hostname",
		},
		{
			Field:  "multiSearchFieldPubIp",
			Type:   ContainsExpressionEnum,
			Column: "pub_net_ip",
		},
		{
			Field:  "multiSearchFieldPrivIp",
			Type:   ContainsExpressionEnum,
			Column: "priv_net_ip",
		},
		{
			Field:  "multiSearchFieldMgmtIp",
			Type:   ContainsExpressionEnum,
			Column: "mgmt_port_ip",
		},
	}

	IpRangeFilterCondition = []SerializersField{
		{
			Field: "cidr",
			Type:  LikeExpressionEnum,
		},
		{
			Field: "env",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "version",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "status",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "operator",
			Type:  EqualExpressionEnum,
		},
		{
			Field:  "nodeId",
			Type:   EqualExpressionEnum,
			Column: "node_id",
		}, {
			Field: "type",
			Type:  EqualExpressionEnum,
		},
	}

	NetIpFilterCondition = []SerializersField{
		{
			Field:  "ipRangeId",
			Type:   EqualExpressionEnum,
			Column: "ip_range_id",
		},
		{
			Field: "ip",
			Type:  LikeExpressionEnum,
		},
		{
			Field: "netmask",
			Type:  LikeExpressionEnum,
		},
		{
			Field: "gateway",
			Type:  LikeExpressionEnum,
		},
		{
			Field: "type",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "version",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "env",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "status",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "operator",
			Type:  EqualExpressionEnum,
		},
		{
			Field:  "multiSearchFieldIp",
			Type:   ContainsExpressionEnum,
			Column: "ip",
		},
	}

	NetSwitchFilterCondition = []SerializersField{
		{
			Field: "status",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "sn",
			Type:  LikeExpressionEnum,
		},
		{
			Field:  "rackSlotId",
			Type:   EqualExpressionEnum,
			Column: "idc_rack_slot_id",
		},
		{
			Field:  "factoryId",
			Type:   EqualExpressionEnum,
			Column: "factory_id",
		},
		{
			Field:  "ipNetId",
			Type:   EqualExpressionEnum,
			Column: "ip_net_Id",
		},
		{
			Field:  "nodeId",
			Type:   EqualExpressionEnum,
			Column: "node_id",
		},
		{
			Field: "type",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		},
	}

	NetRouterFilterCondition = []SerializersField{
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		},
		{
			Field: "status",
			Type:  EqualExpressionEnum,
		},
		{
			Field: "sn",
			Type:  LikeExpressionEnum,
		},
		{
			Field:  "rackSlotId",
			Type:   EqualExpressionEnum,
			Column: "idc_rack_slot_id",
		},
		{
			Field:  "factoryId",
			Type:   EqualExpressionEnum,
			Column: "factory_id",
		},
		{
			Field:  "ipNetId",
			Type:   EqualExpressionEnum,
			Column: "ip_net_Id",
		},
		{
			Field:  "nodeId",
			Type:   EqualExpressionEnum,
			Column: "node_id",
		},
	}

	TicketNodeStateFilterCondition = []SerializersField{
		{
			Field:  "categoryId",
			Type:   EqualExpressionEnum,
			Column: "category_id",
		},
		{
			Field:  "approvalType",
			Type:   EqualExpressionEnum,
			Column: "approval_type",
		},
		{
			Field:  "stateName",
			Type:   LikeExpressionEnum,
			Column: "state_name",
		},
		{
			Field:  "participantType",
			Type:   LikeExpressionEnum,
			Column: "participant_type",
		}, {
			Field:  "hiddenState",
			Type:   EqualExpressionEnum,
			Column: "hidden_state",
		}, {
			Field:  "participantType",
			Type:   EqualExpressionEnum,
			Column: "participant_type",
		},
	}

	TicketProductFilterCondition = []SerializersField{
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		},
		{
			Field:  "allowedVisibilityGroups",
			Type:   LikeExpressionEnum,
			Column: "allowed_visibility_groups",
		},
	}

	TicketCategoryFilterCondition = []SerializersField{
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		},
		{
			Field:  "allowedVisibilityGroups",
			Type:   LikeExpressionEnum,
			Column: "allowed_visibility_groups",
		},
		{
			Field:  "snRuleIdentifier",
			Type:   LikeExpressionEnum,
			Column: "sn_rule_identifier",
		},
	}

	TicketWorkflowWikiFilterCondition = []SerializersField{
		{
			Field: "name",
			Type:  LikeExpressionEnum,
		},
	}

	TicketWorkflowCustomFormFilterCondition = []SerializersField{
		{
			Field:  "fieldType",
			Type:   EqualExpressionEnum,
			Column: "field_type",
		},
		{
			Field:  "fieldKey",
			Type:   LikeExpressionEnum,
			Column: "field_key",
		},
		{
			Field:  "fieldLabel",
			Type:   LikeExpressionEnum,
			Column: "field_label",
		},
	}

	TicketWorkflowTransitionFilterCondition = []SerializersField{
		{
			Field:  "buttonName",
			Type:   EqualExpressionEnum,
			Column: "button_name",
		},
		{
			Field:  "buttonType",
			Type:   EqualExpressionEnum,
			Column: "button_type",
		},
		{
			Field:  "targetWorkflowStateId",
			Type:   EqualExpressionEnum,
			Column: "target_workflow_state_id",
		},
		{
			Field:  "currentWorkflowStateId",
			Type:   EqualExpressionEnum,
			Column: "current_workflow_state_id",
		}, {
			Field:  "categoryId",
			Type:   EqualExpressionEnum,
			Column: "category_id",
		},
	}

	TicketRecordFilterCondition = []SerializersField{
		{
			Field:  "sn",
			Type:   LikeExpressionEnum,
			Column: "sn",
		},
		{
			Field:  "stateId",
			Type:   EqualExpressionEnum,
			Column: "state_id",
		},
		{
			Field:  "categoryId",
			Type:   EqualExpressionEnum,
			Column: "category_id",
		},
		{
			Field:  "status",
			Type:   EqualExpressionEnum,
			Column: "status",
		},
		{
			Field:  "creator",
			Type:   LikeExpressionEnum,
			Column: "creator",
		},
	}

	TicketFlowLogFilterCondition = []SerializersField{
		{
			Field: "id",
			Type:  EqualExpressionEnum,
		}, {
			Field:  "stateName",
			Type:   ContainsExpressionEnum,
			Column: "workflow_node",
		}, {
			Field:  "recordId",
			Type:   EqualExpressionEnum,
			Column: "ticket_workflow_record_id",
		},
	}
)
