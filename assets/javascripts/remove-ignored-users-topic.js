import { withPluginApi } from "discourse/lib/plugin-api";
const HIDDEN_USERS_CLASS = "hidden-user";
export default {
  name: "hide ignored user's topics fix",

  initialize(container) {
    withPluginApi("1.39.0", (api) => {
      // 注册值转换器以修改主题列表列
      api.registerValueTransformer("topic-list-columns", ({ value: columns }) => {
        columns.add("remove-ignored-users", {
          item: (topic) => {
            const currentUser = api.getCurrentUser();
            // 检查当前用户是否存在以及其忽略用户列表
            if (currentUser && currentUser.ignored_users.includes(topic.creator.username)) {
              topic.classList.add(HIDDEN_USERS_CLASS); // 添加隐藏类
            }
            return topic;
          },
          after: "activity",
        });

        return columns; // 返回修改后的列
      });

      // 添加 CSS 样式以隐藏被忽略用户的主题列表项
      const style = document.createElement("style");
      style.innerHTML = `tr.topic-list-item.${HIDDEN_USERS_CLASS} { display: none; }`;
      document.body.appendChild(style); // 将样式添加到文档中
    });
  },
};
