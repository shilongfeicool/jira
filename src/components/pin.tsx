/*
 * @Author: your name
 * @Date: 2022-03-15 16:54:10
 * @LastEditTime: 2022-08-05 16:17:41
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: ProjectPopover
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
