/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80032
 Source Host           : localhost:3306
 Source Schema         : admin_system

 Target Server Type    : MySQL
 Target Server Version : 80032
 File Encoding         : 65001

 Date: 23/06/2023 16:49:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for auth_list
-- ----------------------------
DROP TABLE IF EXISTS `auth_list`;
CREATE TABLE `auth_list`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NULL DEFAULT NULL,
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '权限名称',
  `auth_marker` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '权限标识',
  `menu_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '菜单name',
  `menu_path` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '菜单路径',
  `menu_icon` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '菜单icon',
  `redirect` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '重定向',
  `cpn_path` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '组件路径',
  `auth_type` tinyint(1) NOT NULL COMMENT '权限类型 0菜单 1按钮',
  `sort_no` int NOT NULL COMMENT '排序值',
  `remark` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of auth_list
-- ----------------------------
INSERT INTO `auth_list` VALUES (18, NULL, '美食杰', 'meishijie', 'meishijie', '/meishijie', 'mdi:food', '/meishijie/account-list', '', 0, 10, '', '2023-06-23 16:33:27', '2023-06-23 16:33:27');
INSERT INTO `auth_list` VALUES (19, 18, '账号列表', 'meishijie:accountlist', 'MeishijieAccountList', '/meishijie/account-list', '', '', '/src/views/meishijie/accountList', 0, 0, '', '2023-06-23 16:41:20', '2023-06-23 16:41:20');
INSERT INTO `auth_list` VALUES (20, 18, '食材管理', 'meishijie:ingredientmanagement', 'MeishijieIngredientManagement', '/meishijie/ingredient-management', '', '', '/src/views/meishijie/ingredientManagement', 0, 0, '', '2023-06-23 16:42:09', '2023-06-23 16:42:09');

-- ----------------------------
-- Table structure for role_list
-- ----------------------------
DROP TABLE IF EXISTS `role_list`;
CREATE TABLE `role_list`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `role_name` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '角色名',
  `enable` tinyint(1) NOT NULL COMMENT '是否启用：1启用 0禁用',
  `sort` tinyint NOT NULL COMMENT '排序值',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `role_name`(`role_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role_list
-- ----------------------------
INSERT INTO `role_list` VALUES (1, '测试角色', 1, 6, '2023-02-18 18:17:10', '2023-03-05 01:05:08');
INSERT INTO `role_list` VALUES (2, 'john', 1, 1, '2023-02-22 21:44:27', '2023-02-22 21:44:27');
INSERT INTO `role_list` VALUES (7, 'angel', 0, 0, '2023-02-22 21:54:28', '2023-03-02 22:16:23');
INSERT INTO `role_list` VALUES (13, '学员', 0, 1, '2023-03-02 00:02:11', '2023-03-02 00:02:11');

-- ----------------------------
-- Table structure for user_list
-- ----------------------------
DROP TABLE IF EXISTS `user_list`;
CREATE TABLE `user_list`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '账号',
  `password` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '密码',
  `avatar` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NULL DEFAULT NULL COMMENT '头像url',
  `role_id` tinyint NOT NULL COMMENT '角色id',
  `enable` tinyint(1) NOT NULL COMMENT '是否启用：1启用 0禁用',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_bin ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_list
-- ----------------------------
INSERT INTO `user_list` VALUES (1, 'admin', '123456', 'https://s1.st.meishij.net/user/152/221/t9805402_149181424048398.jpg', 2, 1, '2023-03-04 15:27:56', '2023-03-04 16:39:26');
INSERT INTO `user_list` VALUES (3, 'a012', 'frferf', NULL, 13, 0, '2023-03-04 15:41:57', '2023-03-04 17:57:55');
INSERT INTO `user_list` VALUES (4, 'fref', 'erfffrer', NULL, 2, 1, '2023-03-04 18:36:52', '2023-03-04 18:36:55');
INSERT INTO `user_list` VALUES (5, 'gtggg', 'rrrr', NULL, 2, 1, '2023-03-04 18:37:04', '2023-03-04 18:37:07');
INSERT INTO `user_list` VALUES (6, 'cc', 'eddd', NULL, 2, 1, '2023-03-04 18:37:23', '2023-03-04 18:37:26');
INSERT INTO `user_list` VALUES (7, 'a212', 'frf', NULL, 3, 0, '2023-03-04 18:37:36', '2023-03-05 19:29:47');
INSERT INTO `user_list` VALUES (9, 'fr12222', 'rfff', NULL, 15, 1, '2023-03-04 18:38:09', '2023-03-04 19:27:49');
INSERT INTO `user_list` VALUES (11, 'dddddd', '886', NULL, 1, 1, '2023-03-04 18:38:36', '2023-03-04 19:06:29');

SET FOREIGN_KEY_CHECKS = 1;
