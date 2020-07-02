import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import Categoria from '../components/Categoria.vue'
import Login from '../components/Login.vue'
import Articulo from '../components/Articulo.vue'
import Rol from '../components/Rol.vue'
import Usuario from '../components/Usuario.vue'
import store from '../store'
import Cliente from '../components/Cliente.vue'
import Proveedor from '../components/Proveedor.vue'
import Ingreso from '../components/Ingreso.vue'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'home',
    component: HelloWorld,
    meta : {
      administrador:true,
      almacenero:true,
      vendedor:true
    }
  },
  {
    path: '/categorias',
    name: 'categorias',
    component: Categoria,
    meta : {
      administrador:true,
      almacenero:true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta : {
      libre:true
    }
  },
  {
    path: '/articulo',
    name: 'articulo',
    component: Articulo,
    meta : {
      administrador:true,
      almacenero:true
    }
  },
  {
    path: '/rol',
    name: 'rol',
    component: Rol,
    meta : {
      administrador:true
    }
  },
  {
    path: '/usuario',
    name: 'usuario',
    component: Usuario,
    meta : {
      administrador:true
    }
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: Cliente,
    meta : {
      administrador:true,
      vendedor:true
    }
  },
  {
    path: '/proveedor',
    name: 'proveedor',
    component: Proveedor,
    meta : {
      administrador:true,
      almacenero:true
    }
  },
  {
    path: '/ingreso',
    name: 'ingreso',
    component: Ingreso,
    meta : {
      administrador:true,
      vendedor:true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



router.beforeEach((to, _from, next) =>{
  if(to.matched.some(record => record.meta.libre)){
    next()
  } else if(store.state.usuario && store.state.usuario.rol=='Administrador'){
    if(to.matched.some(record => record.meta.administrador)){
      next()
    }
  }else if(store.state.usuario && store.state.usuario.rol=='Almacenero'){
    if(to.matched.some(record => record.meta.almacenero)){
      next()
    }
  }else if(store.state.usuario && store.state.usuario.rol=='Vendedor'){
    if(to.matched.some(record => record.meta.vendedor)){
      next()
    }
  }else{
    next({
      name: 'login'
    })
    
  }
})
export default router
