/*
 * @Author: your name
 * @Date: 2021-12-12 16:46:34
 * @LastEditTime: 2022-03-15 16:41:21
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/secreens/project-list/search-panel.tsx
 */
/** @jsxImportSource @emotion/react */
import { jsx } from "@emotion/react";
import React from "react";
import { Form, Input, Select } from "antd";
import { Project } from "./list";
import { UserSelect } from "components/user-select";
export interface User {
  id: number;
  name: string;
  email: string;
  title: string;
  organization: string;
  token: string;
}
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
