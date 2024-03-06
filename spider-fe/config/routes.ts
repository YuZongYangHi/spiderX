import Wiki from "@/pages/Ticket/Product/Wiki";
import Category from "@/pages/Ticket/Product/Category";
import React from "react";

/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'DashboardOutlined',
    routes: [
      {
        path: '/dashboard/analysis',
        name: "analysis",
        access: "dashboard.analysis",
        component: './Dashboard/Analysis'
      },
      /*
     {
       path: '/dashboard/monitor',
       name: "monitor",
       access: "dashboard.monitor",
     },

      */
      {
        path: '/dashboard/oncall',
        name: "oncall",
        access: "dashboard.oncall",
        component: './Dashboard/OnCall'
      }
    ]
  },
  {
    path: '/',
    redirect: '/dashboard/analysis',
  },
  {
    path: "/assets",
    name: "assets",
    icon: "FileOutlined",
    access: "assets",
    routes: [
      {
        path: '/assets/nodes/:nodeId/detail',
        name: 'nodes.detail',
        access: "assets.nodes",
        component: "./Assets/Nodes/detail",
        hideInMenu: true,
      },
      {
        path: '/assets/nodes',
        name: 'nodes',
        access: "assets.nodes",
        component: "./Assets/Nodes"
      },{
        path: '/assets/hosts/server-tree',
        name: 'hosts',
        access: "assets.hosts",
        component: "./Assets/Hosts",
      },{
        path: '/assets/hosts/server-tree/*',
        name: 'hosts',
        access: "assets.hosts",
        component: "./Assets/Hosts",
        hideInMenu: true,
        parentKeys:['/assets/hosts/server-tree'],
      }, {
        path: '/assets/net-device',
        name: 'net.device',
        access: 'assets.net.device',
        component: './Assets/NetDevice'
      },{
        path: '/assets/ip-range',
        name: 'ipRange',
        access: 'assets.ip.range',
        component: './Assets/IpRange'
      },{
        path: '/assets/ip',
        name: 'ip',
        access: 'assets.ip',
        component: './Assets/IP'
      }
    ]
  },
  {
    path: "/idc",
    name: "idc",
    icon: "HddOutlined",
    access: "idc",
    routes: [
      {
        path: '/idc/az',
        name: 'az',
        access: 'idc.az',
        component: "./Idc/Az"
      },
      {
        path: '/idc/idc',
        name: 'idc',
        access: 'idc.idc',
        component: './Idc/Idc'
      },
      {
        path: '/idc/room',
        name: 'room',
        access: 'idc.room',
        component: './Idc/IdcRoom'
      },
      {
        path: '/idc/rack',
        name: 'rack',
        access: 'idc.rack',
        component: './Idc/IdcRack'
      },
      {
        path: '/idc/rack-slot',
        name: 'rackSlot',
        access: 'idc.rack.slot',
        component: './Idc/IdcRackSlot'
      },
      {
        path: '/idc/factory',
        name: 'factory',
        access: 'idc.factory',
        component: './Idc/Factory'
      },
      {
        path: '/idc/provider',
        name: 'provider',
        access: 'idc.provider',
        component: './Idc/Provider'
      },
      {
        path: '/idc/suit',
        name: 'suit',
        access: 'idc.suit',
        component: './Idc/Suit'
      }
    ],
  },{
    path: '/ticket',
    name: "ticket",
    icon: "ForkOutlined",
    access: "ticket",
    routes: [
      {
        path: '/ticket/product',
        name: 'add',
        access: 'ticket.add',
        component: './Ticket/Product',
        routes: [
          {
            path: "/ticket/product",
            component: "./Ticket/Product/Product"
          },
          {
            path: "/ticket/product/:productId/category",
            component: './Ticket/Product/Category',
            routes: [
              {
                path: "/ticket/product/:productId/category/:categoryId/document",
                component: './Ticket/Product/Wiki',
              },
            ]
          }, {
            path: "/ticket/product/:productId/category/:categoryId/submit",
            component: "./Ticket/Product/Create"
          }
        ]
      },
      {
        path: '/ticket/todo',
        name: 'todo',
        access: 'ticket.list.todo',
        component: './Ticket/List/Todo'
      },
      {
        path: '/ticket/done',
        name: 'done',
        access: 'ticket.list.done',
        component: './Ticket/List/Done'
      },
      {
        path: '/ticket/apply',
        name: 'apply',
        access: 'ticket.list.apply',
        component: './Ticket/List/Apply'
      }, {
        path: '/ticket/workflow/:sn',
        name: "process",
        access: "ticket.process",
        component: "./Ticket/Process",
        hideInMenu: true
      }
    ]
  },/*{
    path: "/cluster",
    name: "cluster",
    icon: "ClusterOutlined",
    access: "cluster",
    routes: [
      {
        path: '/cluster/list',
        name: 'list',
        access: "cluster.list"
      },
      {
        path: "/cluster/certificate/list",
        name: "certificate.list",
        access: "cluster.certificate.list"
      },
      {
        path: "/cluster/certificate/config",
        name: "certificate.config",
        access: "cluster.certificate.config"
      }
    ]
  },
  */
  {
    path: '/permissions',
    name: 'permissions',
    icon: 'LockOutlined',
    access: 'permissions',
    routes: [
      {
        path: '/permissions/user/list',
        name: 'user.list',
        access: 'permissions.user.list',
        component: './Permissions/User'
      },
      {
        path: '/permissions/group/list',
        name: 'group.list',
        access: 'permissions.group.list',
        component: './Permissions/Group'
      },
      {
        path: '/permissions/resource/list',
        name: 'resource.list',
        access: 'permissions.resource.list',
        component: './Permissions/Resource'
      },
      {
        path: '/permissions/role/:roleId/resources',
        name: 'role.resource.list',
        access: 'permissions.role.rel.resource.list',
        component: './Permissions/Role/Resource',
        hideInMenu: true,
      },
      {
        path: '/permissions/role/:roleId/api/grant',
        name: 'role.api.grant.list',
        access: 'permissions.role.api.grant.list',
        component: './Permissions/Role/Grant',
        hideInMenu: true
      },
      {
        path: '/permissions/role/:roleId/grant',
        name: 'role.grant.list',
        access: 'permissions.role.grant.list',
      },
      {
        path: '/permissions/role',
        name: 'role.list',
        access: 'permissions.role.list',
        component: './Permissions/Role'
      },
      {
        path: '/permissions/apiKey/list',
        name: 'apiKey.list',
        access: 'permissions.apiKey.list',
        component: './Permissions/APIKey'
      },
      {
        path: '/permissions/menu/:menuId/role/grant',
        name: 'menu.role.grant',
        access: 'permissions.menu.grant',
        component: './Permissions/Menu/List/RoleGrant',
        hideInMenu: true
      },
      {
        path: '/permissions/menu/role/:roleId/resource',
        name: 'menu.role.grant.resource',
        access: 'permissions.menu.role.grant.resource',
        component: './Permissions/Menu/Role/Resource',
        hideInMenu: true
      },
      {
        path: '/permissions/menu/role/:roleId/allocation',
        name: 'menu.role.grant.allocation',
        access: 'permissions.menu.role.allocation',
        component: './Permissions/Menu/Role/Allocation',
        hideInMenu: true
      },
      {
        path: '/permissions/menu',
        name: 'menu',
        access: 'permissions.menu',
        component: './Permissions/Menu'
      },
    ]
  }, {
    path: '/audit',
    name: 'audit',
    icon: 'AuditOutlined',
    access: 'audit',
    routes: [
      {
        path: '/audit/operate',
        name: 'operate',
        access: 'audit.operate',
        component: './Audit/Operate'
      },
      {
        path: '/audit/login',
        name: 'login',
        access: 'audit.login',
        component: './Audit/Login'
      }
    ]
  }, {
    path: "/admin",
    name: "admin",
    icon: "ToolOutlined",
    access: "admin",
    routes: [
      {
        path: "/admin/ticket-flow-engine/product",
        name: "ticketProduct",
        access: "admin.ticket.product",
        component: './admin/Ticket/Product'
      }, {
        path: "/admin/ticket-flow-engine/product/:id/category",
        name: "ticketCategory",
        access: "admin.TicketWorkflow",
        component: './admin/Ticket/Workflow',
        hideInMenu: true,
      },{
        path: "/admin/ticket-flow-engine/product/:id/category/:workflowId/designer",
        name: "ticketWorkflowDesigner",
        access: "admin.ticketWorkflowDesigner",
        component: './admin/Ticket/Workflow/dispatcher',
        hideInMenu: true,
      },{
        path: "/admin/suit/season",
        name: "suitSeason",
        access: "admin.suit.season",
        component: './admin/Suit/Season'
      },
      {
        path: "/admin/suit/type",
        name: "suitType",
        access: "admin.suit.type",
        component: './admin/Suit/Type'
      },
      {
        path: "/admin/oncall/drawLots",
        name: "onCallDrawLots",
        access: "admin.oncall.drawLots",
        component: './admin/OnCall/DrawLots'
      }
    ]
  },
  {
    path: '/403',
    layout: false,
    component: './403'
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
