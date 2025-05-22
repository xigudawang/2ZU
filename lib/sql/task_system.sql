/*
 Navicat Premium Data Transfer

 Source Server         : TEST
 Source Server Type    : MySQL
 Source Server Version : 80033 (8.0.33)
 Source Host           : localhost:3306
 Source Schema         : task_system

 Target Server Type    : MySQL
 Target Server Version : 80033 (8.0.33)
 File Encoding         : 65001

 Date: 12/05/2025 11:08:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '任务标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '任务详情',
  `deadline` datetime NOT NULL COMMENT '任务截止时间',
  `sender_id` int NOT NULL COMMENT '发出者ID',
  `receiver_id` int NULL DEFAULT NULL COMMENT '接受者ID',
  `task_state` tinyint NULL DEFAULT 0 COMMENT '任务状态（0未完成，1已完成）',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '任务创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sender_id`(`sender_id` ASC) USING BTREE,
  INDEX `receiver_id`(`receiver_id` ASC) USING BTREE,
  CONSTRAINT `task_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `task_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '任务表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task
-- ----------------------------
INSERT INTO `task` VALUES (1, '测试任务一', '这是一个未完成的任务', '2029-05-30 18:00:00', 1, 1, 0, '2025-05-12 10:55:26');
INSERT INTO `task` VALUES (2, '测试任务二', '这是一个已经完成的任务', '2025-05-10 12:00:00', 1, 1, 1, '2025-05-12 10:55:26');
INSERT INTO `task` VALUES (3, '测试任务二', '这是一个已经过期的任务', '2025-05-09 12:00:00', 1, 1, 0, '2025-05-12 10:55:26');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邮箱',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '加密密码',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '姓名',
  `permission` tinyint NULL DEFAULT 0 COMMENT '权限等级（0普通用户，1管理员）',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
-- 测试账号，邮箱admin@123.com，密码123456，下文已使用bcyrpt加密
INSERT INTO `user` VALUES (1, 'admin@123.com', '$2b$10$6qbxLpdCZypXDHk/MO80juwytaQHtLSyAHZQoQbt.nc4nXUUT3oMq', '1999999999', '测试管理员01', 1, '2025-05-12 10:55:05', '2025-05-12 11:07:52');

SET FOREIGN_KEY_CHECKS = 1;
