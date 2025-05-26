import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import QuestionnaireView from '../views/QuestionnaireView.vue';
import LoginView from '../views/LoginView.vue';
import AuthCallback from '../views/AuthCallback.vue';
import AdminDashboardView from '../views/admin/AdminDashboardView.vue';
import SubmissionsView from '../views/admin/SubmissionsView.vue';
import StatisticsView from '../views/admin/StatisticsView.vue';
import { useAuthStore } from '../store/authStore'; // Import the Auth store

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Questionnaire',
    component: QuestionnaireView,
    meta: { requiresAuth: true } // Protected route
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/callback',
    name: 'AuthCallback',
    component: AuthCallback
  }
  // Future routes can be added here
  // Example:
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('../views/AboutView.vue') // Lazy load
  // }
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/submissions',
    name: 'AdminSubmissions',
    component: SubmissionsView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/statistics',
    name: 'AdminStatistics',
    component: StatisticsView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Wait for Auth0 SDK to finish loading.
  while (authStore.isLoading) {
    await new Promise(resolve => setTimeout(resolve, 50)); // Wait 50ms and re-check
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // If route requires auth and user is not authenticated, redirect to login
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresAdmin) { // Check for admin role
    if (authStore.isAuthenticated && authStore.user) {
      const rolesClaim = 'https://your-app-namespace.com/roles'; // Namespace from task
      const userRoles = authStore.user[rolesClaim] as string[] | undefined; // Type assertion and allow undefined
      if (userRoles && userRoles.includes('admin')) {
        next(); // User is admin, proceed
      } else {
        // User is authenticated but not an admin
        console.warn('User is not an admin, redirecting to Questionnaire.');
        next({ name: 'Questionnaire' }); // Or to a specific 'Access Denied' page
      }
    } else {
      // User is not authenticated (and trying to access admin route), should have been caught by requiresAuth
      // but as a fallback, redirect to login.
      console.warn('User is not authenticated, redirecting to Login for admin route.');
      next({ name: 'Login', query: { redirect: to.fullPath } });
    }
  } else {
    next(); // Proceed as normal for non-protected or non-admin routes
  }
});

export default router;
