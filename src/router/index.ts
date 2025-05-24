import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import QuestionnaireView from '../views/QuestionnaireView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Questionnaire',
    component: QuestionnaireView
  },
  // Future routes can be added here
  // Example:
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('../views/AboutView.vue') // Lazy load
  // }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
