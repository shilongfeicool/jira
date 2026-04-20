/*
 * @Author: your name
 * @Date: 2021-12-12 16:45:56
 * @LastEditTime: 2026-04-20
 * @Description: Project List Component - Displays projects in a table with editing capabilities
 * @FilePath: /jira/src/secreens/project-list/list.tsx
 */
import { useMemo, useCallback, memo } from 'react';
import { Dropdown, Menu, Table, TableProps, message } from "antd";
import type { ColumnsType } from 'antd/es/table';
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
 * Find user name by id with memoization
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

/**
 * Memoized Pin cell component
 */
const PinCell = memo(({ project, onPinChange }: { project: Project; onPinChange: (pin: boolean) => void }) => (
  <Pin
    checked={project.pin}
    onCheckedChange={onPinChange}
  />
));

PinCell.displayName = 'PinCell';

/**
 * Memoized Project Name cell component
 */
const ProjectNameCell = memo(({ name, projectId }: { name: string; projectId: number }) => (
  <Link to={String(projectId)}>{name}</Link>
));

ProjectNameCell.displayName = 'ProjectNameCell';

/**
 * Memoized User Name cell component
 */
const UserCell = memo(({ personId, users }: { personId: number; users: User[] }) => (
  <span>{findUserName(personId, users)}</span>
));

UserCell.displayName = 'UserCell';

/**
 * Memoized Date cell component
 */
const DateCell = memo(({ timestamp }: { timestamp: number | undefined }) => (
  <span>{formatDate(timestamp)}</span>
));

DateCell.displayName = 'DateCell';

/**
 * Memoized Action dropdown component
 */
const ActionMenu = memo(({ onEdit }: { onEdit: () => void }) => (
  <Dropdown
    overlay={
      <Menu>
        <Menu.Item key={MENU_EDIT_KEY}>
          <ButtonNoPadding type="link" onClick={onEdit}>
            {EDIT_LABEL}
          </ButtonNoPadding>
        </Menu.Item>
      </Menu>
    }
  >
    <ButtonNoPadding type="link">...</ButtonNoPadding>
  </Dropdown>
));

ActionMenu.displayName = 'ActionMenu';

export const List = memo(({ users, refresh, ...props }: ListProps) => {
  const { mutate: editProject } = useEditProject();
  const dispatch = useDispatch();

  /**
   * Handle project pin/unpin
   */
  const handlePinProject = useCallback(
    (id: number) => (pin: boolean) => {
      editProject({ id, pin })
        .then(() => {
          refresh?.();
          message.success(pin ? '已置顶' : '已取消置顶');
        })
        .catch(() => {
          message.error('操作失败，请重试');
        });
    },
    [editProject, refresh]
  );

  /**
   * Handle edit project
   */
  const handleEditProject = useCallback(() => {
    dispatch(projectListActions.openProjectModal());
  }, [dispatch]);

  /**
   * Memoized columns definition to avoid recreating on every render
   */
  const columns: ColumnsType<Project> = useMemo(
    () => [
      {
        title: <Pin checked disabled />,
        width: 50,
        render: (_, project: Project) => (
          <PinCell
            project={project}
            onPinChange={handlePinProject(project.id)}
          />
        ),
      },
      {
        title: "名称",
        dataIndex: "name",
        render: (name: string, project: Project) => (
          <ProjectNameCell name={name} projectId={project.id} />
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
          <UserCell personId={project.personId} users={users} />
        ),
        width: 120,
      },
      {
        title: "创建时间",
        render: (_, project: Project) => (
          <DateCell timestamp={project.created} />
        ),
        width: 130,
      },
      {
        render: () => (
          <ActionMenu onEdit={handleEditProject} />
        ),
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
