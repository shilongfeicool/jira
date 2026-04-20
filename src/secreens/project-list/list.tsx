/*
 * @Author: your name
 * @Date: 2021-12-12 16:45:56
 * @LastEditTime: 2026-04-20
 * @Description: Project List Component - Displays projects in a table with editing capabilities
 * @FilePath: /jira/src/secreens/project-list/list.tsx
 */
import { useMemo, useCallback, memo } from 'react';
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

/**
 * Pin Column Component
 */
const PinColumn = memo(({ project, onPinChange }: { project: Project; onPinChange: (pin: boolean) => void }) => (
  <Pin
    checked={project.pin}
    onCheckedChange={onPinChange}
  />
));
PinColumn.displayName = 'PinColumn';

/**
 * Name Column Component
 */
const NameColumn = memo(({ project }: { project: Project }) => (
  <Link to={String(project.id)}>{project.name}</Link>
));
NameColumn.displayName = 'NameColumn';

/**
 * Display Name Column Component
 */
const DisplayNameColumn = memo(({ name }: { name: string }) => (
  <span>{PREFIX_DISPLAY}{name}{SUFFIX_DISPLAY}</span>
));
DisplayNameColumn.displayName = 'DisplayNameColumn';

/**
 * Owner Column Component
 */
const OwnerColumn = memo(({ personId, users }: { personId: number; users: User[] }) => (
  <span>{findUserName(personId, users)}</span>
));
OwnerColumn.displayName = 'OwnerColumn';

/**
 * Created Date Column Component
 */
const CreatedDateColumn = memo(({ timestamp }: { timestamp: number | undefined }) => (
  <span>{formatDate(timestamp)}</span>
));
CreatedDateColumn.displayName = 'CreatedDateColumn';

/**
 * Action Menu Component
 */
const ActionMenu = memo(({ onEdit }: { onEdit: () => void }) => (
  <Menu>
    <Menu.Item key={MENU_EDIT_KEY}>
      <ButtonNoPadding type="link" onClick={onEdit}>
        {EDIT_LABEL}
      </ButtonNoPadding>
    </Menu.Item>
  </Menu>
));
ActionMenu.displayName = 'ActionMenu';

/**
 * Action Column Component
 */
const ActionColumn = memo(({ onEdit }: { onEdit: () => void }) => (
  <Dropdown overlay={<ActionMenu onEdit={onEdit} />}>
    <ButtonNoPadding type="link">...</ButtonNoPadding>
  </Dropdown>
));
ActionColumn.displayName = 'ActionColumn';

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
   * Memoized columns definition
   */
  const columns = useMemo(
    () => [
      {
        title: <Pin checked disabled />,
        width: 50,
        render: (_: unknown, project: Project) => (
          <PinColumn project={project} onPinChange={handlePinProject(project.id)} />
        ),
      },
      {
        title: "名称",
        dataIndex: "name",
        render: (_: unknown, project: Project) => <NameColumn project={project} />,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "显示名称",
        render: (_: unknown, project: Project) => <DisplayNameColumn name={project.name} />,
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
        render: (_: unknown, project: Project) => (
          <OwnerColumn personId={project.personId} users={users} />
        ),
        width: 120,
      },
      {
        title: "创建时间",
        render: (_: unknown, project: Project) => (
          <CreatedDateColumn timestamp={project.created} />
        ),
        width: 130,
      },
      {
        render: () => <ActionColumn onEdit={handleEditProject} />,
        width: 60,
        align: "center" as const,
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
