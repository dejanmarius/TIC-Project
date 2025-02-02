import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({
    isAuthenticated: state.isAuthenticated,
    userRole: state.userRole,
    userName: state.userName,
    userId: state.userId,
  }),
});

const store = createStore({
  state: {
    userRole: localStorage.getItem('userRole') || null,
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    userName: localStorage.getItem('userName') || null,
    userId: localStorage.getItem('userId') || null,
  },
  mutations: {
    setAuthState(state, { isAuthenticated, userRole, userName, userId }) {
      state.isAuthenticated = isAuthenticated;
      state.userRole = userRole;
      state.userName = userName;
      state.userId = userId;

      localStorage.setItem('isAuthenticated', isAuthenticated);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userId', userId);
    },
    clearAuthState(state) {
      state.isAuthenticated = false;
      state.userRole = null;
      state.userName = null;
      state.userId = null;

      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setAuthState', {
        isAuthenticated: true,
        userRole: user.role,
        userName: user.name,
        userId: user.userId,
      });
    },
    logout({ commit }) {
      commit('clearAuthState');
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    getUserRole(state) {
      return state.userRole;
    },
    getUserName(state) {
      return state.userName;
    },
    getUserId(state) {
      return state.userId;
    },
  },
  plugins: [vuexLocal.plugin],
});

export default store;
