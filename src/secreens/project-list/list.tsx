/*
 * @Author: your name
 * @Date: 2021-12-12 16:45:56
 * @LastEditTime: 2026-04-20
 * @Description: Project List Component - Displays projects in a table with editing capabilities
 * @FilePath: /jira/src/secreens/project-list/list.tsx
 */
import { useState, useCallback } from 'react';
import { Dropdown, Menu, Table, TableProps, message } from "antd";
import dayjs from "dayjs";
import { User } from "./search-panel";
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import { useEditProject } from "utils/project";
import { ButtonNoPadding } from "components/lib";
import { useDispatch } from "react-redux";
import { projectListActions } from "./project-list.slice";

// Constants
const PREFIX_DISPLAY = '前缀显示';
const SUFFIX_DISPLAY = '后缀显示';
const ADMIN_ROLE = '管理员';
const UNKNOWN_USER = '未知';
const NO_DATE = '无';
const DATE_FORMAT = "YYYY-MM-DD";
const MENU_EDIT_KEY = 'edit';
const EDIT_LABEL = '编辑';

export interface Project {
  id: number;
  name: string;
  personId: number;
  pin: boolean;
  organization: string;
  created: number;
}

interface ListProps extends TableProps<Project> {
  users: User[];
  refresh?: () => void;
}

/**
 * Find user name by id
 * @param userId - User ID to search
 * @param users - List of users
 * @returns User name or '未知'
 */
const findUserName = (userId: number, users: User[]): string => {
  return users.find((user) => user.id === userId)?.name || UNKNOWN_USER;
};

/**
 * Format date to readable format
 * @param timestamp - Unix timestamp
 * @returns Formatted date string
 */
const formatDate = (timestamp: number | undefined): string => {
  return timestamp ? dayjs(timestamp).format(DATE_FORMAT) : NO_DATE;
};

export const List = ({ users, ...props }: ListProps) => {
  const { mutate: editProject } = useEditProject();
  const dispatch = useDispatch();

  /**
   * Handle project pin/unpin
   */
  const handlePinProject = useCallback(
    (id: number) => (pin: boolean) => {
      editProject({ id, pin }).then(() => {
        props.refresh?.();
        message.success(pin ? '已置顶' : '已取消置顶');
      }).catch(() => {
        message.error('操作失败，请重试');
      });
    },
    [editProject, props]
  );

  /**
   * Handle edit project
   */
  const handleEditProject = useCallback(() => {
    dispatch(projectListActions.openProjectModal());
  }, [dispatch]);

  const columns = [
    {
      title: <Pin checked disabled />,
      width: 50,
      render: (_, project: Project) => (
        <Pin
          checked={project.pin}
          onCheckedChange={handlePinProject(project.id)}
        />
      ),
    },
    {
      title: "名称",
      dataIndex: "name",
      render: (name: string, project: Project) => (
        <Link to={String(project.id)}>{name}</Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "显示名称",
      render: (_, project: Project) => (
        <span>{PREFIX_DISPLAY}{project.name}{SUFFIX_DISPLAY}</span>
      ),
    },
    {
      title: "用户",
      width: 80,
      render: () => ADMIN_ROLE,
    },
    {
      title: "部门",
      dataIndex: "organization",
      width: 150,
    },
    {
      title: "负责人",
      render: (_, project: Project) => (
        <span>{findUserName(project.personId, users)}</span>
      ),
      width: 120,
    },
    {
      title: "创建时间",
      render: (_, project: Project) => (
        <span>{formatDate(project.created)}</span>
      ),
      width: 130,
    },
    {
      render: () => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key={MENU_EDIT_KEY}>
                <ButtonNoPadding type="link" onClick={handleEditProject}>
                  {EDIT_LABEL}
                </ButtonNoPadding>
              </Menu.Item>
            </Menu>
          }
        >
          <ButtonNoPadding type="link">...</ButtonNoPadding>
        </Dropdown>
      ),
      width: 60,
      align: "center",
    },
  ];

  return (
    <Table
      pagination={false}
      rowKey="id"
      columns={columns}
      {...props}
    />
  );
};
