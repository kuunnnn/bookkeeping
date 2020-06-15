import { apolloClient } from "../apollo-graphql";
import queryListAll from "../graphql/query/record-all-list.graphql";
import queryRecordInfo from "../graphql/query/record.graphql";
import mutationUpdateRecord from "../graphql/mutation/update-record.graphql";
import mutationRecordCreate from "../graphql/mutation/create-record.graphql";

export class RecordGraphqlService {
  static fetchRecordInfo(id) {
    return apolloClient.query({
      query: queryRecordInfo,
      variables: { id: Number(id) }
    });
  }

  static update(id, data) {
    return apolloClient.mutate({
      mutation: mutationUpdateRecord,
      variables: { id, data }
    });
  }

  static create(data) {
    return apolloClient.mutate({
      mutation: mutationRecordCreate,
      variables: { data }
    });
  }

  static fetchRecordAll(type = "expense") {
    return apolloClient.query({
      query: queryListAll,
      variables: {
        data: { type }
      }
    });
  }
}
