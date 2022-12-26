/*
 * @Author: 石龙飞 shilongfei@cheyipai.com
 * @Date: 2022-12-26 15:15:00
 * @LastEditors: 石龙飞 shilongfei@cheyipai.com
 * @LastEditTime: 2022-12-26 15:25:26
 * @FilePath: /jira-project/src/__tests__/mark.tsx
 * @Description: test-mark
 */
import { render, screen } from "@testing-library/react";
import { Mark } from "components/mark";

test("mark 组件正确高亮关键词", () => {
  const name = "物料管理";
  const keyword = "管理";

  render(<Mark name={name} keyword={keyword} />);

  expect(screen.getByText(keyword)).toBeInTheDocument();
  expect(screen.getByText(keyword)).toHaveStyle("color: #257AFD");
  expect(screen.getByText("物料")).not.toHaveStyle("color: #257AFD");
});
