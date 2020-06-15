import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "./common.css";
import "animation.css/main.css";
import router from "./router";
import store from "./store";
import { apolloProvider } from "./apollo-graphql";

import {
  Toast,
  NavBar,
  Cell,
  CellGroup,
  Tabbar,
  TabbarItem,
  List,
  Tag,
  Empty,
  SwipeCell,
  Button,
  Dialog,
  Icon,
  Field,
  Form,
  Sticky,
  Popup,
  Picker,
  NumberKeyboard,
  Col,
  Row,
  Calendar,
  Switch,
  Radio,
  RadioGroup
} from "vant";

Vue.config.productionTip = false;
Vue.use(Toast);
Vue.use(Switch);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(List);
Vue.use(Empty);
Vue.use(SwipeCell);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Icon);
Vue.use(Field);
Vue.use(Form);
Vue.use(Tag);
Vue.use(Sticky);
Vue.use(Popup);
Vue.use(Picker);
Vue.use(NumberKeyboard);
Vue.use(Col);
Vue.use(Row);
Vue.use(Calendar);

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
