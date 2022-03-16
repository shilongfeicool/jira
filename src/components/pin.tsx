/*
 * @Author: your name
 * @Date: 2022-03-15 16:54:10
 * @LastEditTime: 2022-03-15 17:02:00
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/components/pin.tsx
 */
import { Rate } from "antd";
import React from "react";
interface PinProps extends React.ComponentProps<typeof Rate> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
export const Pin = (props: PinProps) => {
  const { checked, onCheckedChange, ...resetProps } = props;
  return (
    <Rate
      count={1}
      value={checked ? 1 : 0}
      onChange={(num) => onCheckedChange?.(!!num)}
      {...resetProps}
    ></Rate>
  );
};
