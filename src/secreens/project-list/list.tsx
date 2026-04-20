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
 * @desc 滚动到页面顶部
 */
export const scrollToPageTop = (className = 'page-scroll-container') => {
  const dom = document.getElementsByClassName(className)[0];
  if (dom) {
    dom.scrollTop = 0;
  }
};

/**
 * @desc 新开窗口打开页面
 * @param path: 路径地址
 * @param query: 查询参数
 * @param isOut: 是否是外部链接
 * @param strWindowName: window.open窗口名称
 */
const getAuthCodeByPath = (path: string) => {
  const pathAuthArr: any = JSON.parse(sessionStorage.getItem('pathAuthArr') || '[]');
  const decodePath = decodeURIComponent(path);
  const findCodeArr: [{ link: string; code: string }] = pathAuthArr.filter(
    (item: { link: string; code: string }) => item.link === decodePath
  );
  return findCodeArr && findCodeArr.length > 0 ? findCodeArr[0].code : 'null';
};

/** @desc 获取key */
const getUrlKey = (originUrl: string) => {
  const url = originUrl.split('?')[0];
  const urlSplitArr = url.split('/');
  urlSplitArr.pop();
  const urlWithoutLastRoute = urlSplitArr.join('/');

  const menus: any = JSON.parse(sessionStorage.getItem('pathAuthArr') || '');
  const result: any = [];
  let exactly = false;
  (menus || []).forEach((item: any) => {
    const { link } = item || {};
    if (url.toLowerCase() === link.toLowerCase()) {
      exactly = true;
      result.push({ ...item, exactly: true });
      return;
    }
    if (link.toLowerCase() === urlWithoutLastRoute.toLowerCase()) {
      result.push(item);
    }
  });
  if (exactly) {
    return (result.filter(({ exactly }: any) => !!exactly)[0] || {}).code;
  }
  if (result.length >= 1) {
    return (result[0] || {}).code;
  }
  return '';
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
