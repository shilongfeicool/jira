/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-12-07 17:22:21
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-19 14:47:49
 * @FilePath: /jira-project/src/secreens/kanban/task-modal.tsx
 * @Description: 编辑弹窗
 */
import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useDeleteTask, useEditTask } from "utils/task";
import { useTaskModal, useTasksQueryKey } from "./util";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const TaskModal = () => {
  const [form] = useForm();
  const { editingTask, aditTaskId, close } = useTaskModal();
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(
    useTasksQueryKey()
  );
  const { mutateAsync: deleteTask } = useDeleteTask(useTasksQueryKey());
  const onCancel = () => {
    close();
    form.resetFields();
  };
  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
  };

  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [editingTask, form]);
  const startDelete = () => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除面板吗?",
      onOk() {
        deleteTask({ id: Number(aditTaskId) });
      },
    });
  };
  return (
    <Modal
      forceRender
      okText="确认"
      cancelText="取消"
      confirmLoading={editLoading}
      title="编辑任务"
      visible={!!aditTaskId}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form {...layout} initialValues={editingTask} form={form}>
        <Form.Item
          label="任务名"
          name={"name"}
          rules={[{ required: true, message: "请输入任务名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="经办人"
          name={"processorId"}
          rules={[{ required: true, message: "请选择经办人" }]}
        >
          <UserSelect defaultOptionName="经办人" />
        </Form.Item>
        <Form.Item
          label="类型"
          name={"typeId"}
          rules={[{ required: true, message: "请选择类型" }]}
        >
          <TaskTypeSelect />
        </Form.Item>
      </Form>
      <div style={{ textAlign: "right" }}>
        <Button size="small" style={{ fontSize: "14px" }} onClick={startDelete}>
          删除
        </Button>
      </div>
    </Modal>
  );
};
