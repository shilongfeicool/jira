/*
 * @Author: your name
 * @Date: 2021-12-12 16:45:56
 * @LastEditTime: 2026-04-20
 * @Description: Project List Component - Optimized with React best practices
 * @FilePath: /jira/src/secreens/project-list/list.tsx
 */
import React, { useMemo, useCallback, memo } from 'react';
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
const CONSTANTS = {
  PREFIX_DISPLAY: '前缀显示',
  SUFFIX_DISPLAY: '后缀显示',
  ADMIN_ROLE: '管理员',
  UNKNOWN_USER: '未知',
  NO_DATE: '无',
  DATE_FORMAT: "YYYY-MM-DD",
  MENU_EDIT_KEY: 'edit',
  EDIT_LABEL: '编辑',
} as const;

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
 * Find user name by id with memoization
 */
const findUserName = (userId: number, users: User[]): string => {
  return users.find((user) => user.id === userId)?.name || CONSTANTS.UNKNOWN_USER;
};

/**
 * Format date to readable format
 */
const formatDate = (timestamp: number | undefined): string => {
  return timestamp ? dayjs(timestamp).format(CONSTANTS.DATE_FORMAT) : CONSTANTS.NO_DATE;
};

/**
 * Memoized Pin Column Component
 */
const PinColumn = memo(
  ({ project, onPinChange }: { project: Project; onPinChange: (id: number) => (pin: boolean) => void }) => (
    <Pin
      checked={project.pin}
      onCheckedChange={onPinChange(project.id)}
    />
  ),
  (prev, next) => prev.project.pin === next.project.pin && prev.project.id === next.project.id
);

PinColumn.displayName = 'PinColumn';

/**
 * Memoized Project Name Link Component
 */
const ProjectNameLink = memo(
  ({ project }: { project: Project }) => (
    <Link to={String(project.id)}>{project.name}</Link>
  ),
  (prev, next) => prev.project.id === next.project.id && prev.project.name === next.project.name
);

ProjectNameLink.displayName = 'ProjectNameLink';

/**
 * Memoized Display Name Component
 */
const DisplayName = memo(
  ({ name }: { name: string }) => (
    <span>{CONSTANTS.PREFIX_DISPLAY}{name}{CONSTANTS.SUFFIX_DISPLAY}</span>
  ),
  (prev, next) => prev.name === next.name
);

DisplayName.displayName = 'DisplayName';

/**
 * Memoized User Name Component
 */
const UserNameCell = memo(
  ({ personId, users }: { personId: number; users: User[] }) => (
    <span>{findUserName(personId, users)}</span>
  ),
  (prev, next) => prev.personId === next.personId && prev.users.length === next.users.length
);

UserNameCell.displayName = 'UserNameCell';

/**
 * Memoized Date Cell Component
 */
const DateCell = memo(
  ({ created }: { created: number | undefined }) => (
    <span>{formatDate(created)}</span>
  ),
  (prev, next) => prev.created === next.created
);

DateCell.displayName = 'DateCell';

/**
 * Memoized Action Menu Component
 */
const ActionMenu = memo(
  ({ onEdit }: { onEdit: () => void }) => (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={CONSTANTS.MENU_EDIT_KEY}>
            <ButtonNoPadding type="link" onClick={onEdit}>
              {CONSTANTS.EDIT_LABEL}
            </ButtonNoPadding>
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type="link">...</ButtonNoPadding>
    </Dropdown>
  )
);

ActionMenu.displayName = 'ActionMenu';

export const List = memo(({ users, ...props }: ListProps) => {
  const { mutate: editProject } = useEditProject();
  const dispatch = useDispatch();

  /**
   * Handle project pin/unpin with optimized callback
   */
  const handlePinProject = useCallback(
    (id: number) => (pin: boolean) => {
      editProject({ id, pin })
        .then(() => {
          props.refresh?.();
          message.success(pin ? '已置顶' : '已取消置顶');
        })
        .catch(() => {
          message.error('操作失败，请重试');
        });
    },
    [editProject, props]
  );

  /**
   * Handle edit project with optimized callback
   */
  const handleEditProject = useCallback(() => {
    dispatch(projectListActions.openProjectModal());
  }, [dispatch]);

  /**
   * Memoized columns definition to prevent unnecessary re-renders
   */
  const columns = useMemo<TableProps<Project>['columns']>(
    () => [
      {
        title: <Pin checked disabled />,
        width: 50,
        render: (_, project: Project) => (
          <PinColumn project={project} onPinChange={handlePinProject} />
        ),
      },
      {
        title: "名称",
        dataIndex: "name",
        render: (_, project: Project) => <ProjectNameLink project={project} />,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "显示名称",
        render: (_, project: Project) => <DisplayName name={project.name} />,
      },
      {
        title: "用户",
        width: 80,
        render: () => CONSTANTS.ADMIN_ROLE,
      },
      {
        title: "部门",
        dataIndex: "organization",
        width: 150,
      },
      {
        title: "负责人",
        render: (_, project: Project) => <UserNameCell personId={project.personId} users={users} />,
        width: 120,
      },
      {
        title: "创建时间",
        render: (_, project: Project) => <DateCell created={project.created} />,
        width: 130,
      },
      {
        render: () => <ActionMenu onEdit={handleEditProject} />,
        width: 60,
        align: "center",
      },
    ],
    [handlePinProject, handleEditProject, users]
  );

  return (
    <Table
      pagination={false}
      rowKey="id"
      columns={columns}
      {...props}
    />
  );
});

List.displayName = 'ProjectList';
