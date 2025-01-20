import { withPluginApi } from "discourse/lib/plugin-api";

const HIDDEN_USERS_CLASS = "hidden-user";

export default {
  name: "hide ignored user's topics fix",

  initialize(container) {
    withPluginApi("1.39.0", (api) => {
      // 添加 CSS 样式以隐藏被忽略用户的话题列表项
      const style = document.createElement("style");
      style.innerHTML = `tr.topic-list-item.hidden-user { display: none; }`;
      document.body.appendChild(style);

      // 监听主题列表更新事件
      api.onPageChange((url) => {
        if (url.includes("/latest")) {
          hideIgnoredUsersTopics();
        }
      });

      // 隐藏被忽略用户的话题
      function hideIgnoredUsersTopics() {
        const currentUser = api.getCurrentUser();
        if (currentUser) {
          const ignoredUsers = currentUser.ignored_users;
          const topicListItems = document.querySelectorAll("tr.topic-list-item");

          topicListItems.forEach((item) => {
            const creatorName = item.getAttribute("data-creator-name");
            if (ignoredUsers.includes(creatorName)) {
              item.classList.add(HIDDEN_USERS_CLASS); // 添加隐藏类
            }
          });
        }
      }

      // 初始调用以隐藏已加载的话题
      hideIgnoredUsersTopics();
    });
  },
};
