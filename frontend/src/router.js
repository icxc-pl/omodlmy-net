import Vue from 'vue'
import Router from 'vue-router'

// Components
import Home from './components/pages/Home'
import SendIntention from './components/pages/SendIntention'
import ListIntentions from './components/pages/ListIntentions'
import HowToPray from './components/pages/HowToPray'
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
      component: ListIntentions,
      props: {
        markNew: true
      }
    },
    {
      path: '/moje-intencje',
      name: 'my-intentions',
      component: ListIntentions,
      props: {
        apiMethod: 'getMyIntentions',
        ariaLabel: 'LIST_OF_MY_INTENTIONS'
      }
    },
    {
      path: '/jak-sie-modlic',
      name: 'how-to-pray',
      component: HowToPray
    }
    // {
    //   path: '/informacje',
    //   name: 'information',
    //   component: Information
    // }
  ]
})
