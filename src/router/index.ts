import { createRouter, createWebHistory } from 'vue-router'
import AdminRoutes from "@/router/adminRoutes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path:"/login",
      name:"login",
      component: ()=>import("@/views/login.vue")
    },
    ...AdminRoutes
  ]
})

export default router
