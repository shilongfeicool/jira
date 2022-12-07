/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-11-29 15:00:41
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-07 15:02:51
 * @FilePath: /jira-project/src/secreens/kanban/create-kanban.tsx
 * @Description: 创建Kanban
 */
import { useState } from "react";
import { useAddKanban } from "utils/kanban";
import { Contanier } from "secreens/kanban/kanban-column";
import { useKanbansQueryKey, useProjectIdInUrl } from "./util";
import { Input } from "antd";

export const CreateKanban = () => {
  const [name, setName] = useState("");
  const projectId = useProjectIdInUrl();
  const { mutateAsync: addKanban } = useAddKanban(useKanbansQueryKey());

  const submit = async () => {
    await addKanban({ name, projectId });
    setName("");
  };

  return (
    <Contanier>
      <Input
        size="large"
        placeholder="新建看板名称"
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </Contanier>
  );
};
