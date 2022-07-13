/*
 * @Author: your name
 * @Date: 2022-01-25 16:56:16
 * @LastEditTime: 2022-07-13 15:24:56
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: Lib组件
 * @FilePath: /jira/src/components/lib.tsx
 */
import styled from "@emotion/styled";
import { Button, Spin, Typography } from "antd";
import { DevTools } from "jira-dev-tool";

export const Row = styled.div<{
  gap?: number | boolean;
  between?: boolean;
  marginBottom?: number;
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.between ? "space-between" : undefined)};
  margin-bottom: ${(props) =>
    props.marginBottom ? props.marginBottom : undefined};
  > * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;

    margin-right: ${(props) =>
      typeof props.gap === "number"
        ? props.gap + "rem"
        : props.gap
        ? "2rem"
        : undefined};
  }
`;

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const FullPageLoading = () => (
  <FullPage>
    <Spin size="large" />
  </FullPage>
);

export const FullPageErrorFallback = ({ error }: { error: Error | null }) => (
  <FullPage>
    <DevTools />
    <ErorrBox error={error} />
  </FullPage>
);

// 类型守卫
const isError = (value: any): value is Error => value?.message;

export const ErorrBox = ({ error }: { error: unknown }) => {
  if (isError(error)) {
    return <Typography.Text type="danger">{error.message}</Typography.Text>;
  }
  return null;
};
export const ButtonNoPadding = styled(Button)`
  padding: 0;
`;
