// src/routes.js
import { lazy } from 'react';

const routes = [
  {
    path: '/',
    component: lazy(() => import('../pages/home/HomePage')),
  },
  {
    path: '/categories/:slug',
    component: lazy(() => import('../pages/product/ProductListPage')),
  },
  {
    path: '/product/:productId',
    component: lazy(() => import('../pages/product/ProductDetailPage')),
  },
  {
    path: '/products/:slug',
    component: lazy(() => import('../pages/product/ProductDetailPage')),
  },
  {
    path: '/cart',
    component: lazy(() => import('../pages/Cart')),
  },
  {
    path: '/payment',
    component: lazy(() => import('../pages/Payment')),
  },
  {
    path: '/auth/*',
    component: lazy(() => import('../pages/Authentication')),
  },
  {
    path: '/profile',
    component: ('../Pages/Profile'),
  }
];

export default routes;
