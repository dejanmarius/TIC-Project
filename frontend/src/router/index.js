import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import HomePage from '../views/HomePage.vue'; 
import WatchlistPage from '@/views/WatchlistPage.vue';
import MovieDetailPage from '@/views/MovieDetailPage.vue';
import AdminPage from '@/views/AdminPage.vue';
const routes = [
  

  {
    path: '/',
    name: 'Home', 
    component: HomePage, 
    props: route => ({ search: route.query.search }),
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/watchlist',
    name: 'Watchlist',
    component: WatchlistPage,
  },
  {
    path: '/movies/:id',
    name: 'MovieDetailPage',
    component: MovieDetailPage,
    props: true, // Permite transmiterea parametrului `id` ca prop
  },
  {
    path:'/adminDashboard',
    name:'AdminDashboard',
    component: AdminPage,
    
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;