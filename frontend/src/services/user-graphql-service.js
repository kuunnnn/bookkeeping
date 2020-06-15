import qUserInfo from "../graphql/query/user.graphql";
import mUserName from "../graphql/mutation/update-user-name.graphql";
import { apolloClient } from "../apollo-graphql";

export class UserGraphqlService {
  static info() {
    return apolloClient.query({
      query: qUserInfo,
      fetchPolicy: "no-cache"
    });
  }

  static updateUserName(name) {
    return apolloClient.mutate({
      mutation: mUserName,
      variables: { name },
      fetchPolicy: "no-cache"
    });
  }
}
