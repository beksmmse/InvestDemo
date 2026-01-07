</script>
import { createRouter, createWebHistory } from 'vue-router'
import Group1 from './components/Group1.vue'
import Group2 from './components/Group2.vue'
import Group3 from './components/Group3.vue'
import Group4 from './components/Group4.vue'


const routes = [
  { path: '/', component: Group1 },
  
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})