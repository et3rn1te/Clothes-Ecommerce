// src/routes.js
import { lazy } from 'react';

const routes = [
  {
    path: '/',
    component: lazy(() => import('../Pages/HomePage')),
  },
  {
    path: '/products',
    component: lazy(() => import('../Pages/product/Products')),
  },
  {
    path: '/product_detail/:id',
    component: lazy(() => import('../Pages/product/ProductDetail')),
  }, 
  {
    path: '/category/:categoryName',
    component: lazy(() => import('../Pages/product/ProductsByCategory')),
  },
  {
    path: '/cart',
    component: lazy(() => import('../Pages/Cart')),
  },
  {
    path: '/payment',
    component: lazy(() => import('../Pages/Payment')),
  },
  {
    path: '/auth/*',
    component: lazy(() => import('../Pages/Authentication')),
  },
  {
    path: '/profile',
    component: lazy(() => import('../Pages/Profile')),
  }
];

export default routes;
