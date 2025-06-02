import {lazy} from 'react';
import AdminRoute from "./AdminRoute";
import TestPage from "../pages/admin/TestPage.jsx";
import ProductManagementPage from "../pages/admin/ProductManagementPage.jsx";
import CategoryManagementPage from "../pages/admin/CategoryManagementPage.jsx";

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
        component: lazy(() => import('../pages/product/WishList')),
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
    {
        path: '/403',
        component: lazy(() => import('../pages/error/ForbiddenPage')),
    },
    {
        path: '/admin/test',
        component: () => (
            <AdminRoute>
              <TestPage/>
            </AdminRoute>
        ),
    },
    {
        path: '/admin/product',
        component: () => (
            <AdminRoute>
              <ProductManagementPage/>
            </AdminRoute>
        ),
    },
    {
        path: '/admin/category',
        component: () => (
            <AdminRoute>
              <CategoryManagementPage/>
            </AdminRoute>
        ),
    },
];

export default routes;
