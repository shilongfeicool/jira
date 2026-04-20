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
 * 将xx分钟转为 xx天xx小时xx分
 * @param countdown 分钟
 * @returns { days: number, hours: number, minutes: number }
 */
export const parseToDaysHoursMinutes = (countdown: number) => {
  const days = Math.floor(countdown / 1440);
  const hours = Math.floor((countdown % 1440) / 60);
  const minutes = countdown % 60;
  return {
    days,
    hours,
    minutes,
  };
};

/**
 * 格式化金额
 * @param value 金额
 * @returns 格式化后的金额
 */
export const formatAmount = (value: string | number | undefined) => {
  if (!value && value !== 0) return '--';
  const str = value.toString();
  // 分离整数部分和小数部分
  const parts = str.split('.');
  const integerPart = parts[0].replace(/\D/g, ''); // 只保留数字
  const decimalPart = parts[1] ? '.' + parts[1].replace(/\D/g, '') : ''; // 保留小数点和小数部分

  // 对整数部分添加千位分隔符
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return formattedInteger + decimalPart;
};

/**
 * 获取唯一uuid值
 * */
export const getUUID = (a?: any) => {
  if (a) {
    return (a ^ ((Math.random() * 16) >> (a / 4))).toString(16);
  }
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, getUUID);
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
          title: "repeat名称-",
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
