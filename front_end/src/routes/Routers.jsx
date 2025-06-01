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
    component: lazy(() => import('../pages/auth/Authentication')),
  },
  {
    path: '/profile',
    component: lazy(() => import('../pages/auth/Profile')),
  },
  {
    path: '/wishList',
    component: lazy(() => import('../pages/WishList')),
  },
  {
    path: '/product/:slug',
    component: lazy(() => import('../pages/product/ProductDetailPage')),
  },
  {
    path: '/:genderSlug',
    component: lazy(() => import('../pages/product/CategoryListPage')),
  },
  {
    path: '/collections/:categorySlug',
    component: lazy(() => import('../pages/product/ProductListPage')),
  }, 
  {
    path: '/search',
    component: lazy(() => import('../pages/product/SearchResultPage')),
  },
];

export default routes;
