export const state = () => ({
  user: null, // 初始状态为空或默认值
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
};

export const actions = {
  initUser({ commit }) {
    if (process.client) {
      // 确保只在客户端执行
      const user = localStorage.getItem("user");
      if (user) {
        commit("setUser", JSON.parse(user)); // 使用 action 来调用 mutation
      }
    }
  },
};
