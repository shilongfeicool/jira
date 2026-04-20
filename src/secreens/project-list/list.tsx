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
export function dealNestADData(
  arr: IArr,
  // eslint-disable-next-line default-param-last
  maxVal: any = -1,
  allToNum?: boolean,
  minMaxfiledNames?: { min?: string; max?: string },
  format?: string,
  isPad?: boolean
) {
  const minPad = ':00';
  const maxPad = ':59';
  const minFieldName = minMaxfiledNames?.min || 'min';
  const maxFieldName = minMaxfiledNames?.max || 'max';
  if (judgeArr(arr)) {
    // 排序
    const selfSort = (a: ILine, b: ILine) => {
      if ((a.max_mom as Moment) && typeof a.max_mom === 'object') {
        return a.max_mom.isBefore(b.max_mom) ? -1 : 1;
      }
      return Number(a.max) - Number(b.max);
    };
    const tempArr = arr
      .filter((item) => {
        if (judgeObj(item)) {
          Object.keys(item).forEach((key) => {
            if (allToNum) {
              // eslint-disable-next-line no-param-reassign
              item[key] = formatNumOrSpace(item[key], true);
            } else if ([minFieldName, maxFieldName].includes(key)) {
              if (typeof item[key] !== 'object') {
                if (format) {
                  const time = moment(item[key], format);
                  item[`${key}_mom`] = time;
                  item[key] = time;
                } else {
                  // eslint-disable-next-line no-param-reassign
                  item[key] = formatNumOrSpace(item[key], true);
                }
              } else {
                const time = (item[key] as Moment).format(format);
                item[`${key}_mom`] = item[key];
                const padStr = isPad ? (key === minFieldName ? minPad : maxPad) : '';
                item[key] = time.concat(padStr);
              }
            }
          });
        }
        return item;
      })
      .sort(selfSort)
      .map((item) => {
        if (format) {
          delete item.min_mom;
          delete item.max_mom;
        }
        return item;
      });

    const maxInd = tempArr.findIndex(({ [maxFieldName]: max }) => {
      if (typeof max === 'object') {
        return max.format(format) === maxVal;
      }
      return isPad ? (max as string).replace(maxPad, '') === maxVal : max === maxVal;
    });

    const maxObj = tempArr[maxInd];
    tempArr.splice(maxInd, 1);
    tempArr.push(maxObj);
    return tempArr;
  }
  return arr;
}
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
