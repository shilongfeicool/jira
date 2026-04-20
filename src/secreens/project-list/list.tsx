/*
 * @Author: your name
 * @Date: 2021-12-12 16:45:56
 * @LastEditTime: 2022-07-12 17:44:34
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/secreens/project-list/list.tsx
 */
import { useState, useEfect } from 'react';
import { Dropdown, Menu, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { User } from "./search-panel";
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import { useEditProject } from "utils/project";
import { ButtonNoPadding } from "components/lib";
import { useDispatch } from "react-redux";
import { projectListActions } from "./project-list.slice";
// react-router与react-router-dom的关系,类似与react与react-dom/react-native/react-vr的关系
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
 * 获取url参数
 * @param name 参数key
 */
export const fetchParams = (name: string) => {
  if (!name) return '';
  if (typeof window !== 'undefined') {
    const search = window.location.search || '';
    const params = new URLSearchParams(search);
    const fromSearch = params.get(name);
    if (fromSearch !== null) return fromSearch;
    const hash = window.location.hash || '';
    const qIndex = hash.indexOf('?');
    if (qIndex >= 0) {
      const hashParams = new URLSearchParams(hash.slice(qIndex + 1));
      const fromHash = hashParams.get(name);
      if (fromHash !== null) return fromHash;
    }
  }
  const inst = getCurrentInstance();
  const routerParams = (inst?.router as any)?.params || {};
  const v = routerParams[name];
  return typeof v === 'string' ? v : '';
};
export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject();
  const pinProject = (id: number) => (pin: boolean) =>
    mutate({ id, pin }).then(props.refresh);
  const dispatch = useDispatch();
  const [prefix] = useState('前缀显示')
  const [sufix] = useState('后缀显示')
  return (
    <Table
      pagination={false}
      rowKey="id"
      columns={[
        {
          title: <Pin checked disabled />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名称",
          render(value, Project) {
            return <Link to={String(Project.id)}>{Project.name}</Link>;
          },
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "repeat名称",
          render(value, Project) {
            return prefix + Project.name + sufix;
          }
        },
        {
          title: "用户",
          render(value, Project) {
            return '管理员';
          }
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key={"edit"}>
                      <ButtonNoPadding
                        type="link"
                        onClick={() =>
                          dispatch(projectListActions.openProjectModal())
                        }
                      >
                        编辑
                      </ButtonNoPadding>
                    </Menu.Item>
                  </Menu>
                }
              >
                <ButtonNoPadding type="link">...</ButtonNoPadding>
              </Dropdown>
            );
          },
        },
      ]}
      {...props}
    />
  );
};
