import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Admin from '@/components/Admin/Admin'
import Profile from '@/components/User/Profile'
import Signin from '@/components/User/Signin'
import Exams from '@/components/Admin/Exams/Exams'
import Exam from '@/components/Admin/Exams/Exam'
import CreateExam from '@/components/Admin/Exams/CreateExam'
import Users from '@/components/Admin/Users/Users'
import User from '@/components/Admin/Users/User'
import CreateUser from '@/components/Admin/Users/CreateUser'
import Contingency from '@/components/Contingency/Contingency'
import IssueCont from '@/components/Contingency/IssueCont'
import Reports from '@/components/Contingency/Reports'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:false , technicianAuth:false, crumbs:'Home'}
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:true , technicianAuth:false, crumbs:'/Admin'}
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:false , technicianAuth:false, crumbs:'/Profile'}
    },
    {
      path: '/admin/exams',
      name: 'Exams',
      component: Exams,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:true , technicianAuth:false, crumbs:'/Admin/Exams'}
    },
    {
      path: '/admin/exams/:id',
      name: 'Exam',
      props: true,
      component: Exam,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:true , technicianAuth:false, crumbs:'/Admin/Exams/Update Exam'}
    },
    {
      path: '/admin/exam/new',
      name: 'CreateExam',
      component: CreateExam,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:true , technicianAuth:false, crumbs:'/Admin/Exams/Create Exam'}
    },
    {
      path: '/admin/users',
      name: 'Users',
      component: Users,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:true , technicianAuth:false, crumbs:'/Admin/Users'}
    },
    {
      path: '/admin/users/:id',
      name: 'User',
      props: true,
      component: User,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:true , technicianAuth:false, crumbs:'/Admin/Users/Update User'}
    },
    {
      path: '/admin/user/new',
      name: 'CreateUser',
      component: CreateUser,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:true , technicianAuth:false, crumbs:'/Admin/Users/Create User'}
    },
    {
      path: '/contingency',
      name: 'Contingency',
      component: Contingency,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:false , technicianAuth:false, crumbs:'/Contingency'}
    },
    {
      path: '/contingency/issue',
      name: 'IssueCont',
      component: IssueCont,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:false , technicianAuth:false, crumbs:'/Contingency/Issue'}
    },
    {
      path: '/contingency/reports',
      name: 'Reports',
      component: Reports,
      beforeEnter: AuthGuard,
      meta: { requiresAuth: true , adminAuth:false , technicianAuth:false, crumbs:'/Contingency/Reports'}
    }
  ],
  // mode: 'history' (removes hashbang url)
})
