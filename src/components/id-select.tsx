import { Select } from "antd";
import React from "react";
import { Raw } from "types";

/*
 * @Author: your name
 * @Date: 2022-03-15 15:37:46
 * @LastEditTime: 2022-07-13 16:22:13
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jira/src/components/id-select.tsx
 */
type SelectProps = React.ComponentProps<typeof Select>;
interface IdSelectProps
  extends Omit<
    SelectProps,
    "value" | "onChange" | "defaultOptionName" | "options"
  > {
  value?: Raw | null | undefined;
  onChange?: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}
/**
 * value 可以穿入多种类型的值
 * onChange只会回调 number| undefined类型
 * 等isNaN(Number(value))为true的时候,代表选择默认类型
 * 当选择默认类型的时候,onChange会回调undefined
 * @param props
 */
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options, ...restProps } = props;
  return (
    <Select
      value={options?.length ? toNumber(value) : 0}
      onChange={(value) => onChange?.(toNumber(value) || undefined)}
      {...restProps}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}
      {options?.map((option) => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export const toNumber = (value: unknown) =>
  isNaN(Number(value)) ? 0 : Number(value);
