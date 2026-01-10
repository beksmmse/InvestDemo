import { createRouter, createWebHistory } from 'vue-router'

// ยังคง import จาก folder 'view' ตามเดิม
import Home from '../view/Home.vue' 
import group1 from '../view/Group1.vue'
import group2 from '../view/Group2.vue'
import group3 from '../view/Group3.vue'
import group4 from '../view/Group4.vue'

const routes = [ 
  // --- แก้ไขจุดที่ 2 และ 3 ตรงนี้ ---
  {
    path: '/',        // กำหนด Path หน้าแรก
    name: 'Home',
    component: Home   // นำตัวแปร Home ที่ import ไว้มาใช้ตรงนี้
  },
  // -----------------------------
  {
    path: '/group1',
    name: 'group1',
    component: group1
  },
  {
    path: '/group2',
    name: 'group2',
    component: group2
  },
  {
    path: '/group3',
    name: 'group3',
    component: group3
  },
  {
    path: '/group4',
    name: 'group4',
    component: group4
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router