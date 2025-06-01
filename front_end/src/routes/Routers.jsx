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
    path: '/wishList',
    component: lazy(() => import('../pages/WishList')),
  },
  {
    path: '/product/:slug',
    component: lazy(() => import('../pages/ProductDetailPage')),
  },
  {
    path: '/:genderSlug',
    component: lazy(() => import('../pages/CategoryListPage')),
  },
  {
    path: '/collections/:categorySlug',
    component: lazy(() => import('../pages/ProductListPage')),
  }, 
  {
    path: '/search',
    component: lazy(() => import('../pages/SearchResultPage')),
  },
  {
    path: '/orderHistory',
    component: lazy(() => import('../pages/OrderHistory')),
  },
];

export default routes;
