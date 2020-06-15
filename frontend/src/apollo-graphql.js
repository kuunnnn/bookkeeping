import Vue from "vue";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, Observable } from "apollo-link";
import VueApollo from "vue-apollo";
import { StorageHelper } from "./utils/storage-helper";
import { AuthService } from "./services/auth-service";

// 安装 vue 插件
Vue.use(VueApollo);
let graphqlUrl = "http://127.0.0.1:4000/graphql";
if (process.env.NODE_ENV !== "development") {
  graphqlUrl = "/api/graphql";
}
const httpLink = new HttpLink({
  uri: graphqlUrl
});

// const authMiddleware = new ApolloLink((operation, forward) => {
//   const token = StorageHelper.getToken().token;
//   operation.setContext({
//     headers: {
//       authorization: token ? `Bearer ${token}` : null
//     }
//   });
//   return forward(operation);
// });

class AuthLink extends ApolloLink {
  injectClient(client) {
    this.client = client;
  }

  refreshToken() {
    if (!this.tokenRefreshingPromise) {
      this.tokenRefreshingPromise = AuthService.refreshToken();
    }
    return this.tokenRefreshingPromise;
  }

  setTokenHeader(operation) {
    const token = StorageHelper.getToken().access_token;
    if (token) {
      operation.setContext({
        headers: { authorization: `Bearer ${token}` }
      });
    }
  }

  request(operation, forward) {
    this.setTokenHeader(operation);
    return new Observable(observer => {
      let subscription;
      let innerSubscription;
      try {
        subscription = forward(operation).subscribe({
          next(result) {
            observer.next(result);
          },
          complete: observer.complete.bind(observer),
          error: err => {
            if (err?.result?.errors) {
              const tokenError = err.result.errors.find(
                v => v.extensions.code === "TOKEN_ERROR"
              );
              if (tokenError) {
                this.refreshToken()
                  .then(response => {
                    if (response.access_token) {
                      StorageHelper.setToken(
                        response.access_token,
                        response.refresh_token
                      );
                      this.setTokenHeader(operation);
                      innerSubscription = forward(operation).subscribe(
                        observer
                      );
                    } else {
                      console.log("After refresh token");
                      observer.next(response);
                    }
                  })
                  .catch(e => observer.error(e));
              } else {
                observer.error(err);
              }
            } else {
              observer.error(err);
            }
          }
        });
      } catch (e) {
        observer.error(e);
      }
      return () => {
        if (subscription) subscription.unsubscribe();
        if (innerSubscription) innerSubscription.unsubscribe();
      };
    });
  }
}

// 创建 apollo 客户端
export const apolloClient = new ApolloClient({
  link: new AuthLink().concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

// 创建一个 provider
export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: "loading"
  }
});
