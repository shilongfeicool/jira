/*
 * @Author: your name
 * @Date: 2022-03-21 15:28:06
 * @LastEditTime: 2022-07-13 17:04:25
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: modal
 * @FilePath: /jira/src/secreens/project-list/project-modal.tsx
 */

import styled from "@emotion/styled";
import { Button, Drawer, Form, Input, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { ErorrBox } from "components/lib";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useAddProject, useEditProject } from "utils/project";
import { useProjectModal } from "./util";

export const ProjectModal = () => {
  const { projectModalOpen, close, eidtingProject, isLoading } =
    useProjectModal();
  const useMutateProject = eidtingProject ? useEditProject : useAddProject;

  const { mutateAsync, error, isLoading: mutateLoading } = useMutateProject();
  const [form] = useForm();
  const onFinish = (value: any) => {
    mutateAsync({ ...eidtingProject, ...value }).then(() => {
      form.resetFields();
      close();
    });
  };

  const title = eidtingProject ? "编辑项目" : "创建项目";

  useEffect(() => {
    form.setFieldsValue(eidtingProject);
  }, [eidtingProject, form]);
  return (
    <Drawer
      visible={projectModalOpen}
      width="100%"
      onClose={close}
      forceRender={true}
    >
      <Container>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <>
            <h1>{title}</h1>
            <ErorrBox error={error} />
            <Form
              form={form}
              layout="vertical"
              style={{ width: "40rem" }}
              onFinish={onFinish}
            >
              <Form.Item
                label={"名称"}
                name={"name"}
                rules={[{ required: true, message: "请输入项目名称" }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>
              <Form.Item
                label={"部门"}
                name={"organization"}
                rules={[{ required: true, message: "请输入部门名称" }]}
              >
                <Input placeholder="请输入部门名称" />
              </Form.Item>
              <Form.Item label={"负责人"} name={"personId"}>
                <UserSelect defaultOptionName="负责人" />
              </Form.Item>
              <Form.Item
                label={"负责人"}
                name={"personId"}
                style={{ textAlign: "right" }}
              >
                <Button
                  loading={mutateLoading}
                  type={"primary"}
                  htmlType={"submit"}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  flex-direction: column;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
