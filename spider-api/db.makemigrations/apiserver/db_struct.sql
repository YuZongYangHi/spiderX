CREATE TABLE if not exists `request_whitelist` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    uri VARCHAR(191) NOT NULL unique COMMENT '请求URI前缀',
    method CHAR(10) NOT NULL COMMENT '请求方法',
    description VARCHAR(191) NULL COMMENT '描述信息',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `group` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    name VARCHAR(191) not null COMMENT '组名',
    cn_name VARCHAR(191) not null COMMENT '中文名称',
    email VARCHAR(191) not null COMMENT '邮箱',
    description VARCHAR(191) NULL COMMENT '描述信息',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `user` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    user_id VARCHAR(191) NOT NULL unique COMMENT '用户id',
    username VARCHAR(191) NOT NULL unique COMMENT '用户英文名称',
    name VARCHAR(191) NOT NULL COMMENT '用户中文名称',
    password VARCHAR(191) NOT NULL COMMENT '密码',
    email VARCHAR(191) NOT NULL unique COMMENT '邮箱地址',
    photo VARCHAR(191) NULL COMMENT '头像',
    last_login_time datetime null DEFAULT CURRENT_TIMESTAMP comment '最后登录时间',
    last_login_ip VARCHAR(191) COMMENT '最后登录IP地址',
    group_id bigint(20) NULL COMMENT '用户组',
    is_admin tinyint(1) default 0 COMMENT '管理员',
    is_active tinyint(1) default 1 COMMENT '是否激活',
    is_deleted  tinyint(1) default 0 COMMENT '软删除',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `request_blacklist` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    ip_collection VARCHAR(191) NOT NULL unique COMMENT 'IP',
    type INT(10) default 0 COMMENT 'IP类型',
    description VARCHAR(191) NULL COMMENT '描述信息',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_menu` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    `key` VARCHAR(191) NOT NULL unique COMMENT 'key',
    name VARCHAR(191) NOT NULL unique COMMENT '菜单名称',
    parent_id bigint(20) default 0 COMMENT '父层节点ID',
    create_user varchar(191) not null comment '创建人',
    description VARCHAR(191) NULL COMMENT '描述信息',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
    ) charset = utf8mb4;

CREATE TABLE  if not exists `rbac_menu_permissions_user` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    menu_id bigint(20) not null COMMENT '菜单ID',
    user_id bigint(20) not null COMMENT '用户ID',
    `create`  tinyint(1) default 0 COMMENT '创建',
    `delete`  tinyint(1) default 0 COMMENT '删除',
    `update` tinyint(1) default 0 COMMENT '修改',
    `read` tinyint(1) default 1 COMMENT '查询',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE  if not exists `rbac_menu_permissions_group` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    menu_id bigint(20) not null COMMENT '菜单ID',
    group_id bigint(20) not null COMMENT '用户组ID',
    `create`  tinyint(1) default 0 COMMENT '创建',
    `delete`  tinyint(1) default 0 COMMENT '删除',
    `update` tinyint(1) default 0 COMMENT '修改',
    `read` tinyint(1) default 1 COMMENT '查询',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_menu_role` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    name VARCHAR(191) NOT NULL unique COMMENT '菜单名称',
    description VARCHAR(191) NULL COMMENT '描述信息',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_menu_role_binding_menu` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    role_id bigint(20) not null COMMENT '角色id',
    menu_id bigint(20) not null COMMENT '菜单id',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_menu_role_binding` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    role_id bigint(20) not null COMMENT '角色id',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_menu_role_binding_user` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    user_id bigint(20) not null COMMENT '用户id',
    role_binding_id bigint(20) not null COMMENT 'role_binding_id',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_menu_role_binding_group` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    group_id bigint(20) not null COMMENT '组id',
    role_binding_id bigint(20) not null COMMENT 'role_binding_id',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_api_action` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    resource varchar(191) NOT NULL COMMENT '资源',
    verb char(8) NOT NULL COMMENT '请求方法',
    description VARCHAR(191) NULL COMMENT '描述信息',
    owner varchar(191) not null comment '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_api_role` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    name char(35) unique not null comment '角色名称',
    description VARCHAR(191) NULL COMMENT '描述信息',
    owner varchar(191) not null comment '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_api_role_actions` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    role_id bigint(20) not null COMMENT '角色id',
    action_id bigint(20) not null COMMENT '动作id',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_api_role_binding` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    role_id bigint(20) not null COMMENT '角色id',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_api_role_binding_user` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    role_binding_id bigint(20) not null COMMENT '角色绑定id',
    user_id bigint(20) not null COMMENT '用户id',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_api_role_binding_group` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    role_binding_id bigint(20) not null COMMENT '角色绑定id',
    group_id bigint(20) not null COMMENT '用户组id',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `rbac_api_key` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    name VARCHAR(191) unique NOT NULL COMMENT '名称',
    token VARCHAR(191) NOT NULL COMMENT 'token',
    expire_in bigint(20) not null COMMENT '过期时间/秒',
    description VARCHAR(191) NULL COMMENT '描述信息',
    owner varchar(191) not null comment '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
    ) charset = utf8mb4;

CREATE TABLE if not exists `rbac_api_key_roles` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    role_id bigint(20) not null COMMENT '角色id',
    key_id bigint(20) not null COMMENT '密钥id',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
    ) charset = utf8mb4;

CREATE TABLE if not exists `tree` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    name VARCHAR(191) unique NOT NULL COMMENT '名称',
    level bigint(20) not null COMMENT '层级',
    parent_id bigint(20) not null COMMENT '父节点id',
    full_id_path VARCHAR(191) NOT NULL COMMENT '路径id',
    full_name_path VARCHAR(191) NOT NULL COMMENT '路径名称',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

/*
    type: 1 server, 2 node
 */
CREATE TABLE if not exists `tree_resource_mapping` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    tree_id bigint(20) not null COMMENT 'service tree id',
    resource_id bigint(20) not null COMMENT 'resource id',
    `type` int(10) not null COMMENT 'resource type',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;


CREATE TABLE if not exists `server_provider` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name VARCHAR(191) unique NULL COMMENT '供应商名称',
    alias VARCHAR(191) unique NULL COMMENT '别名',
    creator VARCHAR(191) not null COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `server_factory` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name VARCHAR(191) unique NULL COMMENT '厂商名称',
    mode_name VARCHAR(191) unique NULL COMMENT '厂商型号',
    en_name VARCHAR(191) NULL COMMENT '英文名称',
    cn_name VARCHAR(191) NULL COMMENT '中文名称',
    description VARCHAR(191) NULL COMMENT '描述信息',
    creator VARCHAR(191) not null COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `server_tag` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name VARCHAR(191) unique NULL COMMENT '标签名称',
    creator VARCHAR(191) not null COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `server_rel_tag` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    server_id bigint(20) not null comment '服务器id',
    tag_id  bigint(20) not null comment '标签id',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
    ) charset = utf8mb4;

CREATE TABLE if not exists `server_suit` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    season VARCHAR(191) NULL COMMENT '套餐系列/季节',
    `type` VARCHAR(191) NULL COMMENT '套餐类型/AI计算型',
    gpu VARCHAR(191) NULL COMMENT 'gpu',
    raid VARCHAR(191) NULL COMMENT 'raid',
    name VARCHAR(191) unique NULL COMMENT '套餐名称/GE63',
    cpu VARCHAR(191) NULL COMMENT 'cpu',
    memory VARCHAR(191) NULL COMMENT '内存',
    storage VARCHAR(191) NULL COMMENT '存储',
    nic VARCHAR(191) NULL COMMENT '网络接口卡',
    psu VARCHAR(191) NULL COMMENT '电源',
    creator VARCHAR(191) not null COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `server_suit_type` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name VARCHAR(191) unique NULL COMMENT '套餐名称',
    creator VARCHAR(191) not null COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `server_suit_season` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name VARCHAR(191) unique NULL COMMENT '套餐系列',
    creator VARCHAR(191) not null COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `az` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name VARCHAR(191) NOT NULL unique COMMENT '名称',
    cn_name VARCHAR(191) NULL unique COMMENT '中文名称',
    region VARCHAR(191) NOT NULL COMMENT '地区',
    province VARCHAR(191) NOT NULL COMMENT '省份',
    `type` int(10) NOT NULL COMMENT '类型: 物理/虚拟',
    status int(10) NOT NULL COMMENT '状态: 使用中/不可用',
    creator VARCHAR(191) not null COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

/* IDC */
CREATE TABLE if not exists `idc` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name VARCHAR(191) NOT NULL unique COMMENT '名称',
    cn_name VARCHAR(191) NULL unique COMMENT '中文名称',
    status int(10) NOT NULL COMMENT '状态',
    physics_az_id bigint(20) null COMMENT '物理AZ',
    virtual_az_id bigint(20) null COMMENT '虚拟AZ',
    address VARCHAR(191) NULL COMMENT '机房地址',
    region VARCHAR(191) NULL COMMENT '大区',
    city VARCHAR(191) NULL COMMENT '城市',
    idc_phone VARCHAR(191) NULL COMMENT '机房电话',
    idc_mail VARCHAR(191) NULL COMMENT '机房邮箱',
    cabinet_num bigint(20) NOT NULL COMMENT '机柜总数',
    comment VARCHAR(191) NULL COMMENT '备注',
    creator VARCHAR(191) not null COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_physics_az` FOREIGN KEY(physics_az_id) REFERENCES az(id) ON DELETE CASCADE,
    CONSTRAINT `fk_virtual_az` FOREIGN KEY(virtual_az_id) REFERENCES az(id) ON DELETE CASCADE
) charset = utf8mb4;

/* IDC 房间 */
CREATE TABLE if not exists `idc_room` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    room_name VARCHAR(191) NOT NULL unique COMMENT '房间名称',
    idc_id bigint(20) not null COMMENT '机房id',
    full_name VARCHAR(191) NOT NULL COMMENT '全称',
    status int(10) NOT NULL COMMENT '状态: 在线/离线',
    pdu_standard VARCHAR(191) NOT NULL COMMENT 'PDU标准: 国标/欧标/国欧',
    power_mode VARCHAR(191) NOT NULL COMMENT '供电方式: 双UPS/双HVDC/HVDC+市电',
    rack_size VARCHAR(191) NOT NULL COMMENT '柜体尺寸: 42U/45U/46U/47U/47U/52U/53U/54U',
    bearer_type VARCHAR(191) NOT NULL COMMENT '承载类型: L型支架/固定托盘/L型+托盘/导轨',
    bear_weight VARCHAR(191) NOT NULL COMMENT '机位承重: 50KG/60KG/80KG/120KG',
    creator VARCHAR(191) not null COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_idc` FOREIGN KEY(idc_id) REFERENCES idc(id) ON DELETE CASCADE
) charset = utf8mb4;

/* IDC机架 */
CREATE TABLE if not exists `idc_rack` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    idc_room_id bigint(20) not null COMMENT 'IDC房间id',
    name VARCHAR(191) NOT NULL unique COMMENT '机柜',
    `row` VARCHAR(191) NOT NULL COMMENT '行(排)',
    `col` VARCHAR(191) NOT NULL COMMENT '列(编号)',
    `group` VARCHAR(191) NOT NULL COMMENT '组',
    u_num int(20) NOT NULL COMMENT '服务器槽位数',
    rated_power int(20) NOT NULL COMMENT '额定功耗',
    net_u_num int(20) NOT NULL COMMENT '交换机槽位数',
    `current` int(35) NOT NULL COMMENT '电流',
    status int(10) NOT NULL COMMENT '状态: 可用/建设/停用/维护',
    creator VARCHAR(191) not null COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_room` FOREIGN KEY(idc_room_id) REFERENCES idc_room(id) ON DELETE CASCADE
) charset = utf8mb4;

/* IDC机架位 */
CREATE TABLE if not exists `idc_rack_slot` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    idc_rack_id bigint(20) not null COMMENT 'IDC机架id',
    `type` int(10) not null COMMENT '服务器/交换机',
    u_num int(10) NOT NULL COMMENT 'u数',
    slot int(20) NOT NULL COMMENT '槽位',
    port int(10) NOT NULL  COMMENT '端口号',
    status int(10) not null comment '状态',
    creator VARCHAR(191) not null COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_idc_rack` FOREIGN KEY(idc_rack_id) REFERENCES idc_rack(id) ON DELETE CASCADE
) charset = utf8mb4;

/*
    (1, "移动"),
    (2, "联通"),
    (3, "电信"),
    (4, "多线")

    (1, "初始化"),
    (2, "已上线"),
    (3, "维护中"),
    (4, "冷备"),
    (5, "规划中"),
    (6, "裁撤"),
    (7, "建设中"),
    (8, "裁撤新建")

    (1, "容器节点"),
    (2, "虚拟机节点"),
    (3, "物理机节点"),
    (4, "混合节点")

    (1, "标准"),
    (2, "骨干"),
    (3, "核心")

    (1, "直签"),
    (2, "代理")
*/
CREATE TABLE if not exists `node` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name  VARCHAR(191) unique NOT NULL COMMENT '节点名称',
    cn_name VARCHAR(191) unique NOT NULL COMMENT '节点中文名称',
    operator int(10) not null COMMENT '运营商',
    bandwidth VARCHAR(191) NOT NULL COMMENT '带宽',
    region VARCHAR(191) NOT NULL COMMENT '大区',
    province VARCHAR(191) NOT NULL COMMENT '省份',
    status int(10) not null COMMENT '运行状态',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    `attribute` int(10) not null COMMENT '节点属性',
    grade int(10) not null COMMENT '节点等级',
    comment VARCHAR(191) NULL COMMENT '备注',
    contract VARCHAR(191) NULL COMMENT '签约方式',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    is_deleted int(1) default 0 comment '软删除'
) charset = utf8mb4;


/*
    (1, machine)
    (2, switch)
    (3, router)
 */
CREATE TABLE if not exists `server_rel_ip` (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    `type` int(10) not null COMMENT '绑定类型',
    ip_net_id bigint(20) not null COMMENT '绑定IP的id',
    resource_id varchar(191) not null COMMENT '绑定资源的id',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

/*
    (1, "线上"),
    (2, "测试"),
    (3, "隔离")

    (1, "ipv4"),
    (2, "ipv6"),

    (1, "未使用"),
    (2, "已使用")
 */

CREATE TABLE if not exists `server_ip_range` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    cidr VARCHAR(191) NOT NULL UNIQUE COMMENT 'ip段',
    env int(10) not null COMMENT '环境',
    version int(10) not null COMMENT 'ip版本',
    description VARCHAR(191) NULL COMMENT '描述信息',
    status int(10) not null COMMENT '状态',
    operator int(10) not null COMMENT '运营商',
    `type` int(10) not null COMMENT '类型',
    node_id bigint(20) not null COMMENT '节点id',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    net_domain int(10) not null COMMENT '网络域',
    gateway VARCHAR(191) not null COMMENT '网关',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_ip_range_node` FOREIGN KEY(node_id) REFERENCES node(id) ON DELETE CASCADE
) charset = utf8mb4;

/*
    (1, "线上"),
    (2, "测试"),
    (3, "隔离"),

    (1, "管理网"),
    (2, "内网"),
    (3, "公网"),

    (1, "未使用"),
    (2, "已使用")
 */

CREATE TABLE if not exists `server_ip` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    ip VARCHAR(191) NOT NULL UNIQUE COMMENT 'ip地址',
    netmask VARCHAR(191) NOT NULL COMMENT '掩码',
    gateway VARCHAR(191) NOT NULL COMMENT '网关',
    ip_range_id bigint(20) not null COMMENT 'ip段id',
    `type` int(10) not null COMMENT '类型',
    version int(10) not null COMMENT 'ip版本',
    env int(10) not null COMMENT '环境',
    operator int(10) not null COMMENT '运营商',
    status int(10) not null COMMENT '状态',
    description VARCHAR(191) NULL COMMENT '描述信息',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_ip_range` FOREIGN KEY(ip_range_id) REFERENCES server_ip_range(id) ON DELETE CASCADE
    ) charset = utf8mb4;

CREATE TABLE if not exists `net_switch` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name VARCHAR(191) NOT NULL unique COMMENT '设备名',
    ip_net_id bigint(20) not null COMMENT 'ip实例',
    node_id bigint(20) not null COMMENT '节点',
    idc_rack_slot_id bigint(20) not null COMMENT '机架位',
    factory_id bigint(20) not null COMMENT '厂商',
    sn VARCHAR(191) NOT NULL unique COMMENT '序列号',
    `type` int(10) not null COMMENT '千兆/万兆',
    status int(10) not null COMMENT '状态',
    mutual_rel_ip VARCHAR(191) NOT NULL COMMENT '互连IP',
    up_rel_port VARCHAR(191) NOT NULL COMMENT '上联口',
    up_ip_rel_port VARCHAR(191) NOT NULL COMMENT '上联IP关联端口',
    description VARCHAR(191) NULL COMMENT '描述信息',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    username VARCHAR(191) NOT NULL COMMENT '用户名',
    password VARCHAR(191) NOT NULL COMMENT '密码',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_switch_device_ip_net_id` FOREIGN KEY(ip_net_id) REFERENCES server_ip(id) ON DELETE CASCADE,
    CONSTRAINT `fk_net_switch_device_node` FOREIGN KEY(node_id) REFERENCES node(id) ON DELETE CASCADE,
    CONSTRAINT `fk_net_switch_device_idc_rack_slot` FOREIGN KEY(idc_rack_slot_id) REFERENCES idc_rack_slot(id) ON DELETE CASCADE,
    CONSTRAINT `fk_net_switch_device_factory` FOREIGN KEY(factory_id) REFERENCES server_factory(id) ON DELETE CASCADE
) charset = utf8mb4;

CREATE TABLE if not exists `net_router` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    sn VARCHAR(191) NOT NULL unique COMMENT '序列号',
    name VARCHAR(191) NOT NULL unique COMMENT '设备名',
    node_id bigint(20) not null COMMENT '节点',
    idc_rack_slot_id bigint(20) not null COMMENT '机架位',
    ip_net_id bigint(20) not null COMMENT 'ip实例',
    factory_id bigint(20) not null COMMENT '厂商',
    status int(10) not null COMMENT '状态',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    description VARCHAR(191) NULL COMMENT '描述信息',
    username VARCHAR(191) NOT NULL COMMENT '用户名',
    password VARCHAR(191) NOT NULL COMMENT '密码',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_net_router_device_node` FOREIGN KEY(node_id) REFERENCES node(id) ON DELETE CASCADE,
    CONSTRAINT `fk_net_router_device_idc_rack_slot` FOREIGN KEY(idc_rack_slot_id) REFERENCES idc_rack_slot(id) ON DELETE CASCADE,
    CONSTRAINT `fk_net_router_device_factory` FOREIGN KEY(factory_id) REFERENCES server_factory(id) ON DELETE CASCADE,
    CONSTRAINT `fk_net_router_net_ip` FOREIGN KEY(ip_net_id) REFERENCES server_ip(id) ON DELETE CASCADE
) charset = utf8mb4;

/*
 type: 1: physical, 2: cloud, 3: virtual
 status:
    (1, "初始化"),
    (2, "已上线"),
    (3, "维护中"),
    (4, "冷备"),
    (5, "规划中"),
    (6, "裁撤"),
    (7, "建设中"),
    (8, "裁撤新建")

 role:
    (1, lvs)
    (2, master)
    (3, node)
    (4, none)

  operator:
    (1, "移动"),
    (2, "联通"),
    (3, "电信"),
    (4, "多线")
 */
CREATE TABLE if not exists `server` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    sn VARCHAR(191) unique NOT NULL COMMENT 'serializer number',
    hostname VARCHAR(191) unique NOT NULL COMMENT '主机名称',
    `type` int(10) not null COMMENT 'service type',
    suit_id bigint(20) NULL COMMENT '套餐id',
    comment VARCHAR(191) NULL COMMENT '备注',
    power_info VARCHAR(191) NULL COMMENT '电源',
    power_cost VARCHAR(191) NULL COMMENT '功耗',
    `role` int(10) not null comment '角色',
    operator int(10) not null comment '运营商',
    provider_id bigint(20) NULL COMMENT '供应商id',
    factory_id  bigint(20) NULL COMMENT '厂商id',
    node_id bigint(20) not NULL COMMENT '节点id',
    idc_rack_slot_id  bigint(20) NULL COMMENT 'IDC机架位',
    status int(10) not null COMMENT '运行状态',
    app_env VARCHAR(191) NOT NULL COMMENT '应用环境',
    app_env_desc VARCHAR(191) NULL COMMENT '应用环境描述',
    system_type VARCHAR(191) NULL COMMENT '系统内核',
    system_version VARCHAR(191) NULL COMMENT '系统版本号',
    system_arch VARCHAR(191) NULL COMMENT '系统平台',
    belong_to VARCHAR(191) NOT NULL COMMENT '归属',
    belong_to_desc VARCHAR(191) NULL COMMENT '归属描述',
    arrival_time VARCHAR(191) NOT NULL comment '到货时间',
    overdue_time  VARCHAR(191) NOT NULL  comment '过保时间',
    priv_net_ip VARCHAR(191) NOT NULL COMMENT '内网地址',
    priv_net_mask VARCHAR(191) NOT NULL COMMENT '内网掩码',
    priv_net_gw VARCHAR(191) NOT NULL COMMENT '内网网关',
    pub_net_ip VARCHAR(191) NOT NULL COMMENT '公网地址',
    pub_net_mask VARCHAR(191) NOT NULL COMMENT '公网掩码',
    pub_net_gw VARCHAR(191) NOT NULL COMMENT '公网网关',
    mgmt_port_ip VARCHAR(191) NOT NULL COMMENT '管理口地址',
    mgmt_port_mask VARCHAR(191) NOT NULL COMMENT '管理口掩码',
    mgmt_port_gw VARCHAR(191) NOT NULL COMMENT '管理口网关',
    creator VARCHAR(191) not null COMMENT '创建人',
    is_deleted int(10) default 0 COMMENT '已删除',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_node` FOREIGN KEY(node_id) REFERENCES node(id) ON DELETE CASCADE,
    CONSTRAINT `fk_provider` FOREIGN KEY(provider_id) REFERENCES server_provider(id) ON DELETE SET NULL,
    CONSTRAINT `fk_factory` FOREIGN KEY(factory_id) REFERENCES server_factory(id) ON DELETE SET NULL,
    CONSTRAINT `fk_idc_rack_slot` FOREIGN KEY(idc_rack_slot_id) REFERENCES idc_rack_slot(id) ON DELETE SET NULL,
    CONSTRAINT `fk_suit` FOREIGN KEY(suit_id) REFERENCES server_suit(id) ON DELETE SET NULL
    ) charset = utf8mb4;

/*
    1: create
    2: update
    3: delete
 */
CREATE TABLE if not exists `operate_log` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    username VARCHAR(191) NOT NULL COMMENT '操作人',
    resource_pk varchar(191) not null COMMENT '资源ID',
    `type` int(20) NOT NULL DEFAULT 0 COMMENT '操作类型',
    `datetime` datetime null DEFAULT CURRENT_TIMESTAMP comment '操作时间',
    src_data longtext NULL COMMENT '操作前数据',
    resource_name varchar(191) not null comment '资源名称',
    target_data longtext NULL COMMENT '操作后数据',
    diff_data longtext NULL COMMENT '差异数据',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

CREATE TABLE if not exists `audit_login` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    username VARCHAR(191) NOT NULL COMMENT '登录人',
    `type` int(10) NOT NULL COMMENT '类型',
    `datetime` datetime null DEFAULT CURRENT_TIMESTAMP comment '操作时间',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

/*
    工单产品
    allowed_visibility_groups: null 代表全员可见
 */
CREATE TABLE if not exists `ticket_product` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name VARCHAR(191) NOT NULL UNIQUE COMMENT '分类名称',
    icon longtext NULL COMMENT '图标',
    allowed_visibility_groups VARCHAR(191) NULL COMMENT '允许可见的用户组, 多个逗号分割',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    description VARCHAR(191) NULL COMMENT '描述信息',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;


/*
    工单分类
 */
CREATE TABLE if not exists `ticket_category` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name VARCHAR(191) NOT NULL UNIQUE COMMENT '名称',
    product_id bigint(20) not null COMMENT '分类id',
    allowed_visibility_groups VARCHAR(191) NULL COMMENT '允许可见的用户组, 多个逗号分割',
    sn_rule_identifier VARCHAR(4) not null unique comment '流水号规则',
    icon longtext NULL COMMENT '图标',
    webhook VARCHAR(191) NULL COMMENT '推送地址',
    layout ENUM('vertical', 'inline', 'horizontal') default 'horizontal' comment '表单布局',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    description VARCHAR(191) NULL COMMENT '描述信息',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_ticket_product` FOREIGN KEY(product_id) REFERENCES ticket_product(id) ON DELETE CASCADE
) charset = utf8mb4;

/*
    工单流分类文档
 */
CREATE TABLE if not exists `ticket_category_document` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    name VARCHAR(191) NOT NULL COMMENT '名称',
    url VARCHAR(191) NOT NULL COMMENT '链接',
    category_id bigint(20) not null COMMENT '工单工作流id',
    description VARCHAR(191) NULL COMMENT '描述信息',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_ticket_category` FOREIGN KEY(category_id) REFERENCES ticket_category(id) ON DELETE CASCADE
) charset = utf8mb4;

/*
    工单流程状态
    participant_type: 1: 指定人员 2: 指定组 3: 无需处理
    approval_type: 1: 人工 2: 自动通过 3: 自动拒绝
    current_form_field_state_set: {"description": 1, 2, 3 } 1: read 2: rw 3: hide
 */
CREATE TABLE if not exists `ticket_workflow_state` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    state_name VARCHAR(191) NOT NULL COMMENT '流程中转名称',
    priority bigint(20) default 0 comment '流转优先级',
    current_form_field_state_set JSON comment '当前流转字段显示的属性',
    approval_type int(10) default 1 comment '审批类型',
    hidden_state TINYINT(1) default 0 comment '隐藏状态',
    participant_type int(10) default 1 comment '参与者类型',
    participant varchar(191) not null comment '参与者, 多个逗号分割',
    category_id bigint(20) not null COMMENT '工单工作流id',
    webhook VARCHAR(191) NULL COMMENT '推送地址',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_ticket_state_category_id` FOREIGN KEY(category_id) REFERENCES ticket_category(id) ON DELETE CASCADE
) charset = utf8mb4;

/*
    工单流程控制流转
 */
CREATE TABLE if not exists `ticket_workflow_transition` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    button_name VARCHAR(50) not null comment '按钮名称',
    button_type ENUM('agree', 'reject', 'cancel') not null comment '按钮类型',
    category_id bigint(20) not null COMMENT '工单工作流id',
    current_workflow_state_id bigint(20) not null COMMENT '当前工作流程状态id',
    target_workflow_state_id bigint(20) not null COMMENT '目标工作流状态id',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_ticket_transition_category_id` FOREIGN KEY(category_id) REFERENCES ticket_category(id) ON DELETE CASCADE,
    CONSTRAINT `fk_ticket_transition_workflow_src_state` FOREIGN KEY(current_workflow_state_id) REFERENCES ticket_workflow_state(id) ON DELETE CASCADE,
    CONSTRAINT `fk_ticket_transition_workflow_target_state` FOREIGN KEY(target_workflow_state_id) REFERENCES ticket_workflow_state(id) ON DELETE CASCADE
) charset = utf8mb4;

/*
    工单提交记录表
 */
CREATE TABLE if not exists `ticket_workflow_record` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    sn VARCHAR(191) not null unique  comment '流水号',
    state_id bigint(20) not null COMMENT '当前状态id',
    category_id bigint(20) not null COMMENT '工单工作流id',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    status tinyint(1) default 0 COMMENT '工单状态',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_ticket_record_workflow` FOREIGN KEY(category_id) REFERENCES ticket_category(id) ON DELETE CASCADE,
    CONSTRAINT `fk_ticket_record_workflow_state` FOREIGN KEY(state_id) REFERENCES ticket_workflow_state(id) ON DELETE CASCADE
) charset = utf8mb4;

/*
    工单流转日志
*/
CREATE TABLE if not exists `ticket_workflow_flow_log` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    ticket_workflow_record_id bigint(20) not null COMMENT '工单记录id',
    approver varchar(191) not null comment '审批人',
    status varchar(191) not null comment '状态',
    workflow_node varchar(191) not null comment '流程节点',
    approval_status ENUM('agree', 'reject', 'cancel') not null comment '审批状态',
    node_priority bigint(20) not null comment '节点优先级',
    handle_duration varchar(191) not null comment '处理耗时',
    suggestion longtext null comment '意见',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_ticket_record_flow_log` FOREIGN KEY(ticket_workflow_record_id) REFERENCES ticket_workflow_record(id) ON DELETE CASCADE
) charset = utf8mb4;

/*
    工单提交记录评论
 */
CREATE TABLE if not exists `ticket_workflow_record_comment` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    ticket_workflow_record_id bigint(20) not null COMMENT '工单记录id',
    user_id int not null comment '用户id',
    content longtext not null comment '评论内容',
    current_state varchar(191) comment '当前流流程状态名称',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_ticket_workflow_record_comment_record_id` FOREIGN KEY(ticket_workflow_record_id) REFERENCES ticket_workflow_record(id) ON DELETE CASCADE,
    CONSTRAINT `fk_ticket_workflow_record_comment_user_id` FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
) charset = utf8mb4;

/*
    工单工作流自定义表单展示字段
    1、字符串 2、整数 3、日期范围(年月日分十秒 - 年月日分十秒） 4、开关
    5、日期(年月日) 6、日期时间(年月日分十秒) 7、单选 8、多选
    9、下拉 10、多选下拉 11、文本域 12、远程搜索
    13、用户搜索 14、用户组搜索
 */
CREATE TABLE if not exists `ticket_workflow_custom_form_field` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    category_id bigint(20) not null COMMENT '工单工作流id',
    field_type int(30) not null comment '字段类型',
    field_key varchar(191) not null comment '字段名称',
    field_label varchar(191) not null  comment '字段标识',
    placeholder varchar(191) not null comment '提示内容',
    required TINYINT(1) default 0 comment '是否必填',
    default_value varchar(191) null comment '默认值',
    remote_url varchar(191) null comment '远程请求的url',
    field_options longtext NULL comment '选项',
    priority bigint(20) default 0 comment '表单显示优先级',
    width char(20) default 'lg' comment '组件宽度',
    row_margin int(20) default 12 comment '行边距',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_ticket_workflow_custom_field_workflow_id` FOREIGN KEY(category_id) REFERENCES ticket_category(id) ON DELETE CASCADE
) charset = utf8mb4;

 /*
    工单记录真实写入字段
  */
CREATE TABLE if not exists `ticket_workflow_record_form_field` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    field_type int(30) not null comment '字段类型',
    field_label varchar(191) not null comment '字段标识',
    field_key varchar(191) not null comment '字段名称',
    field_value longtext not null comment '字段实际的值',
    ticket_workflow_record_id bigint(20) not null COMMENT '工单记录id',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_ticket_workflow_record_form_field_record_id` FOREIGN KEY(ticket_workflow_record_id) REFERENCES ticket_workflow_record(id) ON DELETE CASCADE
) charset = utf8mb4;

/*
    工单流程节点催促
 */
CREATE TABLE if not exists `ticket_record_node_urge` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    record_id bigint(20) not null COMMENT '工单记录id',
    node_state_id bigint(20) not null COMMENT '节点状态id',
    creator VARCHAR(191) NOT NULL COMMENT '创建人',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间',
    CONSTRAINT `fk_urge_ticket_record_id` FOREIGN KEY(record_id) REFERENCES ticket_workflow_record(id) ON DELETE CASCADE,
    CONSTRAINT `fk_urge_ticket_node_state_id` FOREIGN KEY(node_state_id) REFERENCES ticket_workflow_state(id) ON DELETE CASCADE
) charset = utf8mb4;


/*
    值班表抽签
 */
CREATE TABLE if not exists `duty_lottery` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    user_ids longtext not null comment '用户id集合',
    duty_type ENUM('weekly', 'daily') NOT NULL comment '值班周期',
    effective_time datetime null DEFAULT CURRENT_TIMESTAMP comment '值班生效时间',
    description VARCHAR(191) NULL COMMENT '描述信息',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;


/*
    值班表临时换班
 */
CREATE TABLE if not exists `duty_exchange` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    `current_user` VARCHAR(191) not null comment '当前值班人',
    history_user  VARCHAR(191) not null comment '历史值班人',
    datetime datetime null DEFAULT CURRENT_TIMESTAMP comment '值班时间',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

/*
    值班表
 */
CREATE TABLE if not exists `duty_roster` (
    id bigint(20) AUTO_INCREMENT PRIMARY KEY COMMENT 'pk',
    `current_user` varchar(191) not null comment '当前值班人',
    history_user varchar(191) not null comment '历史值班人',
    datetime datetime null DEFAULT CURRENT_TIMESTAMP comment '值班时间',
    duty_lottery_id bigint(20) not null comment '抽签表',
    create_time datetime null DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time datetime null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '修改时间'
) charset = utf8mb4;

INSERT INTO
    user(
    user_id,
    username,
    name,
    email,
    photo,
    password
)
VALUES(
          "0a2ad3f0-05d6-4ec3-ac91-0fb75100aada",
          "spider",
          "蜘蛛侠",
          "spider@spider.io",
          "http://localhost:8000/img/spiderx.png",
          "7e81c1e08899b3338b969ad294ffd9ac"
      );

INSERT INTO
    request_whitelist(uri, description)
VALUES
    ("/api/v1/users/login", "用户登录接口"),
    ("/health", "健康检查"),
    ("/metrics", "监控指标");

