/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80300
 Source Host           : localhost:3306
 Source Schema         : admin_system

 Target Server Type    : MySQL
 Target Server Version : 80300
 File Encoding         : 65001

 Date: 15/06/2025 23:45:42
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for auth_list
-- ----------------------------
DROP TABLE IF EXISTS `auth_list`;
CREATE TABLE `auth_list` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `parent_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '权限名称',
  `auth_marker` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '权限标识',
  `menu_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '菜单name',
  `menu_path` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '菜单路径',
  `menu_icon` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '菜单icon',
  `menu_hidden` tinyint(1) DEFAULT NULL COMMENT '菜单是否隐藏：1 是 0 否',
  `redirect` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '重定向',
  `cpn_path` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '组件路径',
  `auth_type` tinyint(1) NOT NULL COMMENT '权限类型 0菜单 1按钮',
  `sort_no` int NOT NULL COMMENT '排序值',
  `remark` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '备注',
  `enable` tinyint(1) NOT NULL COMMENT '是否启用 0：否 1：是',
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of auth_list
-- ----------------------------
BEGIN;
INSERT INTO `auth_list` VALUES ('37f49afb-be60-467e-98e3-f77720bb5156', 'a9fed9a5-bacd-4325-a765-278039dc0431', '首页栏位', 'meishijie:homeColumn', 'MeishijieHomeColumn', '/meishijie/home-column', '', 0, '', '/src/views/meishijie/homeColumn', 0, 2, '', 1, '2025-03-29 17:40:10', '2025-03-29 17:41:17');
INSERT INTO `auth_list` VALUES ('9fdac25d-63b5-5540-33ce-9d44aad86e9f', 'a9fed9a5-bacd-4325-a765-278039dc0431', '账号列表', 'meishijie:accountlist', 'meishijie_account_list', '/meishijie/account-list', '', 0, '', '/src/views/meishijie/accountList', 0, 0, '', 1, '2023-06-23 16:41:20', '2024-05-28 01:44:27');
INSERT INTO `auth_list` VALUES ('a9fed9a5-bacd-4325-a765-278039dc0431', NULL, '美食杰', 'meishijie', 'meishijie', '/meishijie', 'mdi:food', 0, '/meishijie/account-list', '', 0, 10, '', 1, '2023-06-23 16:33:27', '2023-11-18 15:32:00');
INSERT INTO `auth_list` VALUES ('ad67c3f3-1e54-4bc8-a714-d15612f840ce', 'a9fed9a5-bacd-4325-a765-278039dc0431', '菜谱列表', 'meishijie:accountlist', 'meishijie_recipeList', '/meishijie/recipe-list', '', 0, '', '/src/views/meishijie/recipeList', 0, 1, '', 1, '2024-05-28 02:18:52', '2024-05-28 02:18:52');
INSERT INTO `auth_list` VALUES ('bcb9d763-b870-8d01-3987-1ea121f65859', '9fdac25d-63b5-5540-33ce-9d44aad86e9f', '添加账号', 'meishijie:accountlist:add', '', '', '', 0, '', '', 1, 0, '', 1, '2023-11-18 06:47:17', '2023-11-18 15:25:08');
INSERT INTO `auth_list` VALUES ('cf1778b2-e10c-0e1a-5651-41715f861913', 'a9fed9a5-bacd-4325-a765-278039dc0431', '食材管理', 'meishijie:ingredientmanagement', 'MeishijieIngredientManagement', '/meishijie/ingredient-management', '', 0, '', '/src/views/meishijie/ingredientManagement', 0, 0, '', 0, '2023-06-23 16:42:09', '2025-03-29 17:35:13');
COMMIT;

-- ----------------------------
-- Table structure for role_auth_list
-- ----------------------------
DROP TABLE IF EXISTS `role_auth_list`;
CREATE TABLE `role_auth_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL COMMENT '角色id',
  `auth_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '权限id',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for role_list
-- ----------------------------
DROP TABLE IF EXISTS `role_list`;
CREATE TABLE `role_list` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `role_name` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '角色名',
  `enable` tinyint(1) NOT NULL COMMENT '是否启用：1启用 0禁用',
  `sort` tinyint NOT NULL COMMENT '排序值',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `role_name` (`role_name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role_list
-- ----------------------------
BEGIN;
INSERT INTO `role_list` VALUES (1, '测试角色', 1, 1, '2024-05-26 21:01:05', '2024-05-26 21:01:05');
COMMIT;

-- ----------------------------
-- Table structure for user_list
-- ----------------------------
DROP TABLE IF EXISTS `user_list`;
CREATE TABLE `user_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '账号',
  `password` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '密码',
  `avatar` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '头像url',
  `role_id` tinyint NOT NULL COMMENT '角色id',
  `enable` tinyint(1) NOT NULL COMMENT '是否启用：1启用 0禁用',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of user_list
-- ----------------------------
BEGIN;
INSERT INTO `user_list` VALUES (1, 'admin', '123456', 'https://s1.st.meishij.net/user/152/221/t9805402_149181424048398.jpg', 2, 1, '2023-03-04 15:27:56', '2023-03-04 16:39:26');
INSERT INTO `user_list` VALUES (3, 'a012', 'frferf', NULL, 13, 0, '2023-03-04 15:41:57', '2023-03-04 17:57:55');
INSERT INTO `user_list` VALUES (4, 'fref', 'erfffrer', NULL, 2, 1, '2023-03-04 18:36:52', '2023-03-04 18:36:55');
INSERT INTO `user_list` VALUES (5, 'gtggg', 'rrrr', NULL, 2, 1, '2023-03-04 18:37:04', '2023-03-04 18:37:07');
INSERT INTO `user_list` VALUES (6, 'cc', 'eddd', NULL, 2, 1, '2023-03-04 18:37:23', '2023-03-04 18:37:26');
INSERT INTO `user_list` VALUES (7, 'a212', 'frf', NULL, 3, 0, '2023-03-04 18:37:36', '2023-03-05 19:29:47');
INSERT INTO `user_list` VALUES (9, 'fr12222', 'rfff', NULL, 15, 1, '2023-03-04 18:38:09', '2023-03-04 19:27:49');
INSERT INTO `user_list` VALUES (11, 'dddddd', '886', NULL, 1, 1, '2023-03-04 18:38:36', '2023-03-04 19:06:29');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
