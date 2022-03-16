import React from "react";

/*
 * @Author: your name
 * @Date: 2022-01-27 14:28:09
 * @LastEditTime: 2022-01-27 14:40:41
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
