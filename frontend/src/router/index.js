import Vue from "vue";
import VueRouter from "vue-router";

import Running from "../views/expense";
import { StorageHelper } from "../utils/storage-helper";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Running",
    component: Running
  },
  {
    path: "/income",
    name: "Income",
    component: () =>
      import(/* webpackChunkName: "Income" */ "../views/income.vue")
  },
  {
    path: "/editUserName",
    name: "EditUserName",
    component: () =>
      import(
        /* webpackChunkName: "EditUserName" */ "../views/edit-user-name.vue"
      )
  },
  {
    path: "/account",
    name: "Account",
    component: () =>
      import(/* webpackChunkName: "Account" */ "../views/account.vue")
  },
  {
    path: "/setting",
    name: "Setting",
    component: () =>
      import(/* webpackChunkName: "Setting" */ "../views/setting.vue")
  },
  {
    path: "/category",
    name: "Category",
    component: () =>
      import(/* webpackChunkName: "Category" */ "../views/category.vue")
  },
  {
    path: "/account-info",
    name: "AccountInfo",
    component: () =>
      import(/* webpackChunkName: "AccountInfo" */ "../views/account-info.vue")
  },
  {
    path: "/category-edit",
    name: "CategoryEdit",
    component: () =>
      import(
        /* webpackChunkName: "CategoryEdit" */ "../views/category-edit.vue"
      )
  },

  {
    path: "/account-edit",
    name: "AccountAdd",
    component: () =>
      import(/* webpackChunkName: "AccountAdd" */ "../views/account-edit.vue")
  },
  {
    path: "/record-info",
    name: "RecordInfo",
    component: () =>
      import(/* webpackChunkName: "RecordInfo" */ "../views/record-info.vue")
  },
  {
    path: "/record-edit",
    name: "RecordEdit",
    component: () =>
      import(/* webpackChunkName: "RecordEdit" */ "../views/record-edit.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/login.vue")
  }
];

const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  const isLogin = StorageHelper.getToken().access_token;
  if (!isLogin && to.path !== "/login") {
    next({ path: "/login", query: { redirect: from.fullPath } });
  } else {
    if (isLogin && to.path === "/login") {
      next(false);
    } else {
      next();
    }
  }
});
export default router;
