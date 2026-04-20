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
export const openAnotherWindowTab = ({
  path,
  query,
  isOut = false,
  strWindowName = '_blank',
}: {
  path: string;
  query?: { [key: string]: any };
  isOut?: boolean;
  strWindowName?: '_blank' | '_self';
}) => {
  const paramsStr = query ? `?${QS.stringify(query)}` : '';
  const { origin, pathname, protocol } = window.location;
  const dealPathWithProtocol = isOut && path.split(':').length < 2 && protocol ? `${protocol}${path}` : path;
  // 如果是本窗口打开 那就直接改href
  if (strWindowName === '_self') {
    window.open(dealPathWithProtocol + paramsStr, strWindowName);
    return;
  }
  if (!isLocal) {
    // 其他环境拼接统一工作台地址 可能会出现跨域问题
    let base = '';
    try {
      base = window.parent.location.href;
    } catch (e) {
      base = document.referrer;
    }

    const prefix = process.env.MUJI_APP_CHENIU_PLATFORM;
    const localProjectUrl = `${prefix?.substring(0, prefix.length - 1)}${path}${paramsStr}`;
    // 个别Mac机型, 无法通过 document.referrer 获取完成路径
    if (base.indexOf('key') === -1) {
      const authKey = getAuthCodeByPath(window.location.href);
      base = `${process.env.MUJI_APP_GZT_URL}?key=${authKey}&url=${localProjectUrl}`;
    }
    try {
      const host = base.split('?')[0];
      const pathName = base.split('?')[1];
      const paramList = pathName.split('&');

      // const url = paramList.filter((item: string) => item.indexOf('url') > -1)[0];
      // const url_decode = decodeURIComponent(url.split('=')[1]);
      // const url_host = url_decode.split('#')[0];
      const relativePath = !isOut ? localProjectUrl : `${dealPathWithProtocol}${paramsStr}`; // 项目相对地址和参数

      // 替换key
      if (!isOut) {
        const newKey = getUrlKey(relativePath);
        console.log('newKey', newKey);
        if (newKey) {
          paramList[0] = `key=${newKey}`;
        }
      }

      // 拼接URL
      const paramArr = paramList.map((item: string) => {
        let newItem = item;
        if (item.indexOf('url') > -1) {
          newItem = `url=${encodeURIComponent(relativePath)}`;
        }
        return newItem;
      });
      let pathname_paramArr = '';
      paramArr.forEach((item: string, index: number) => {
        if (index === paramArr.length - 1) {
          pathname_paramArr += `${item}`;
        } else {
          pathname_paramArr += `${item}&`;
        }
      });
      console.log('--_blank 页面即将跳转--', `${host}?${pathname_paramArr}`);
      window.open(`${host}?${pathname_paramArr}`);
    } catch (e) {
      dispatch.router.push({
        path: dealPathWithProtocol,
        query,
      });
      console.error('打开页面出错', e);
    }
  } else {
    // 本地开发环境直接打开项目相对地址
    const relativePath = !isOut ? `${origin}${pathname}#${dealPathWithProtocol}${paramsStr}` : `${dealPathWithProtocol}${paramsStr}`; // 项目相对地址和参数
    console.log('_blank 本地开发环境直接打开项目相对地址');
    window.open(relativePath);
  }
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
