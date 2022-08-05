import React from "react";

/*
 * @Author: your name
 * @Date: 2022-01-27 14:28:09
 * @LastEditTime: 2022-08-05 16:18:17
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: ErrorVBoundary
 * @FilePath: /jira/src/components/error-boundary.tsx
 */
// children fallbackRender
type FallbackRender = (props: { error: Error | null }) => React.ReactElement;
export class ErrorVBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  state = {
    error: null,
  };
  // 当子组件抛出异常,这里会接收到并且调用
  static getDerivedStateFromError(error: Error) {
    return error;
  }
  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;
    if (error) {
      return fallbackRender({ error });
    }
    return children;
  }
}
