import { LayoutDefault, RouteWrapper } from '@/components/layouts'
import routerList from './auto-register-route'

export default [
  {
    path: '/',
    component: LayoutDefault,
    meta: {
      title: 'home',
      group: 'apps',
      icon: ''
    },
    redirect: '/overview',
    children: [
      {
        name: 'RouteWrapper',
        path: '/erp',
        component: RouteWrapper,
        meta: {
          title: 'erp',
          icon: 'mdi-shield',
          group: 'cms'
        },
        children: routerList
      }
    ]
  }
]
