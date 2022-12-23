/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-12-23 15:03:46
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-23 15:30:10
 * @FilePath: /jira-project/src/secreens/epic/create-epic.tsx
 * @Description: create-epic
 */
import styled from "@emotion/styled";
import { Button, Drawer, DrawerProps, Form, Input, Spin } from "antd";
import { useAddEpic } from "utils/epic";
import { useEpicsQueryKey } from "./util";
import { ErorrBox } from "components/lib";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { useProjectIdInUrl } from "secreens/kanban/util";

export const CreateEpic = (
  props: Pick<DrawerProps, "visible"> & { onClose: () => void }
) => {
  const {
    mutateAsync: addEpic,
    isLoading,
    error,
  } = useAddEpic(useEpicsQueryKey());
  const [form] = useForm();
  const projectId = useProjectIdInUrl();

  const onFinish = async (values: any) => {
    await addEpic({ ...values, projectId });
    props.onClose();
  };

  useEffect(() => {
    form.resetFields();
  }, [form, props.visible]);

  return (
    <Drawer
      forceRender
      destroyOnClose
      width={"100%"}
      visible={props.visible}
      onClose={props.onClose}
    >
      <Container>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <>
            <h1>创建任务组</h1>
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
                rules={[{ required: true, message: "请输入任务组名" }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>
              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  loading={isLoading}
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