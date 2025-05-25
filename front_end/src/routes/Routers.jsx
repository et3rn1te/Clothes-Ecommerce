// src/routes.js
import { lazy } from 'react';

const routes = [
  {
    path: '/',
    component: lazy(() => import('../pages/HomePage')),
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
    component: lazy(() => import('../pages/Profile')),
  },
  {
    path: '/product/:id',
    component: lazy(() => import('../pages/ProductDetailPage')),
  },
  {
    path: '/product/slug/:slug',
    component: lazy(() => import('../pages/ProductDetailPage')),
  },
  {
    path: '/:genderSlug',
    component: lazy(() => import('../pages/GenderPage')),
  },
  {
    path: '/:genderSlug/:categorySlug',
    component: lazy(() => import('../pages/CategoryPage')),
  },
];

export default routes;
