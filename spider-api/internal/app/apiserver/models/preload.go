package models

import "gorm.io/gorm/clause"

var (
	IdcRelPreload = []PreloadCondition{
		{
			Rel: clause.Associations,
		},
	}
	NetIpRelPreload = []PreloadCondition{
		{
			Rel: "IpRange",
		},
		{
			Rel: "IpRange.Node",
		},
		{
			Rel: "IpRange.Node.ProductLines",
		},
	}
	NetSwitchRelPreload = []PreloadCondition{
		{
			Rel: "Node",
		},
		{
			Rel: "RackSlot",
		},
		{
			Rel: "Factory",
		},
		{
			Rel: "Ip",
		},
	}
	NetRouterRelPreload = []PreloadCondition{
		{
			Rel: "Node",
		},
		{
			Rel: "RackSlot",
		},
		{
			Rel: "Factory",
		},
		{
			Rel: "Ip",
		},
	}

	TicketWorkflowPreload = []PreloadCondition{
		{
			Rel: "Product",
		},
	}

	TicketWorkflowWikiPreload = []PreloadCondition{
		{
			Rel: "Category",
		},
		{
			Rel: "Category.Product",
		},
	}

	TicketWorkflowStatePreload = []PreloadCondition{
		{
			Rel: "Category",
		},
		{
			Rel: "Category.Product",
		},
	}

	TicketWorkflowTransitionPreload = []PreloadCondition{
		{
			Rel: "Category",
		},
		{
			Rel: "Category.Product",
		},
		{
			Rel: "SrcState",
		},
		{
			Rel: "TargetState",
		},
	}

	TicketRecordPreload = []PreloadCondition{
		{
			Rel: "Category.Product",
		}, {
			Rel: "State",
		},
	}

	TicketRecordFlowLogPreload = []PreloadCondition{
		{
			Rel: "Record",
		}, {
			Rel: "Record.Category",
		},
		{
			Rel: "Record.Category.Product",
		},
		{
			Rel: "Record.State",
		},
	}

	TicketRecordFormPreload = []PreloadCondition{
		{
			Rel: "Record",
		},
		{
			Rel: "Record.State",
		},
	}

	TicketRecordCommentPreload = []PreloadCondition{
		{
			Rel: "User",
		},
		{
			Rel: "Record",
		},
	}
)

func GeneratePreloadList(preloadCond []PreloadCondition) []string {
	var preloads []string
	for _, rel := range preloadCond {
		preloads = append(preloads, rel.Rel)
	}
	return preloads
}
