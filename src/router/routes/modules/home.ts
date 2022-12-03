import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const home: AppRouteModule = {
  path: '/home',
  name: 'Home',
  component: LAYOUT,
  redirect: '/home/workbench',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.home.home'),
  },
  children: [
    {
      path: 'workbench',
      name: 'Workbench',
      component: () => import('/@/views/home/workbench/index.vue'),
      meta: {
        title: t('routes.home.workbench'),
      },
    },
  ],
}

export default home
