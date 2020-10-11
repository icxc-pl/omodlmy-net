import Vue from 'vue'
import Router from 'vue-router'

// Components
import Home from './components/Home'
import SendIntention from './components/SendIntention'
import ListIntentions from './components/ListIntentions'
//import Information from './components/Information'

// Init
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/nadaj-intencje',
      name: 'send-intention',
      component: SendIntention
    },
    {
      path: '/lista-intencji',
      name: 'list-intentions',
      component: ListIntentions
    }
    // {
    //   path: '/informacje',
    //   name: 'information',
    //   component: Information
    // }
  ]
})
