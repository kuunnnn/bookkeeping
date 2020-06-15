import { apolloClient } from "../apollo-graphql";
import queryList from "../graphql/query/account-list.graphql";
import querySign from "../graphql/query/account.graphql";
import queryAccountAndRecordList from "../graphql/query/account-record-list.graphql";
import MutationCreate from "../graphql/mutation/create-account.graphql";
import MutationUpdate from "../graphql/mutation/update-account.graphql";
import MutationDelete from "../graphql/mutation/delete-account.graphql";

export class AccountGraphqlService {
  static fetchAccountList() {
    return apolloClient.query({
      query: queryList,
      fetchPolicy: "no-cache"
    });
  }

  static info(id) {
    return apolloClient.query({
      query: querySign,
      variables: { id },
      fetchPolicy: "no-cache"
    });
  }
  static infoAndRecordList(id) {
    return apolloClient.query({
      query: queryAccountAndRecordList,
      variables: { id },
      fetchPolicy: "no-cache"
    });
  }

  static create(data) {
    return apolloClient.mutate({
      mutation: MutationCreate,
      variables: { data },
      fetchPolicy: "no-cache"
    });
  }

  static update(id, data) {
    return apolloClient.mutate({
      mutation: MutationUpdate,
      variables: { id, data },
      fetchPolicy: "no-cache"
    });
  }

  static delete(id) {
    return apolloClient.mutate({
      mutation: MutationDelete,
      variables: { id },
      fetchPolicy: "no-cache"
    });
  }
}
