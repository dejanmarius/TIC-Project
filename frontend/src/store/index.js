import { createStore } from 'vuex';
export default createStore({
    state: {
      isAuthenticated: false,
      userRole: null,
      user: null,  
    },
    mutations: {
      setAuth(state, { isAuthenticated, userRole, user }) {
        state.isAuthenticated = isAuthenticated;
        state.userRole = userRole;
        state.user = user;
      },
      logout(state) {
        state.isAuthenticated = false;
        state.userRole = null;
        state.user = null;
      },
    },
    actions: {
      login({ commit }, userData) {
        commit('setAuth', {
          isAuthenticated: true,
          userRole: userData.role,
          user: userData,
        });
      },
      logout({ commit }) {
        commit('logout');
      },
    },
    getters: {
      isAuthenticated: (state) => state.isAuthenticated,
      userRole: (state) => state.userRole,
      user: (state) => state.user,
    },
  });