/*
 * @Author: your name
 * @Date: 2021-12-12 16:46:34
 * @LastEditTime: 2022-07-22 15:50:55
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/secreens/project-list/search-panel.tsx
 */
/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import React from "react";
import { Form, Input, Select } from "antd";
import { Project } from "types/Project";
import { UserSelect } from "components/user-select";
import { User } from "types/User";
interface SearchPanelProps {
  users: User[];
  params: Partial<Pick<Project, "name" | "personId">>;
  setParams: (param: SearchPanelProps["params"]) => void;
}
export const SearchPanel = ({ params, users, setParams }: SearchPanelProps) => {
  return (
    <Form
      layout="inline"
      css={{
        marginBottom: "2rem",
      }}
    >
      <Form.Item>
        <Input
          type="text"
          placeholder="项目名"
          value={params.name}
          onChange={(event) => {
            console.log(event.target.value, "-----");
            setParams({
              ...params,
              name: event.target.value,
            });
          }}
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName="负责人"
          value={params.personId}
          onChange={(value) => {
            console.log(value);
            setParams({
              ...params,
              personId: value,
            });
          }}
        ></UserSelect>
      </Form.Item>
    </Form>
  );
};
