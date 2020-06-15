import { apolloClient } from "../apollo-graphql";
import queryList from "../graphql/query/category-list.graphql";
import querySign from "../graphql/query/category.graphql";
import mutationSign from "../graphql/mutation/update-category.graphql";
import mutationCreateCategory from "../graphql/mutation/create-category.graphql";
import mutationCategoryDelete from "../graphql/mutation/delete-category.graphql";

export class CategoryGraphqlService {
  static async fetchList(type) {
    return apolloClient.query({
      query: queryList,
      variables: { type },
      fetchPolicy: "no-cache"
    });
  }

  static async createCategory(data) {
    return apolloClient.mutate({
      mutation: mutationCreateCategory,
      variables: {
        data
      },
      fetchPolicy: "no-cache"
    });
  }

  static async fetchSignInfo(id) {
    return apolloClient.query({
      query: querySign,
      variables: {
        id: id
      },
      fetchPolicy: "no-cache"
    });
  }

  static async updateInfo(id, name) {
    return apolloClient.mutate({
      mutation: mutationSign,
      variables: {
        id: id,
        data: { name }
      },
      fetchPolicy: "no-cache"
    });
  }

  static async delete(id) {
    return apolloClient.mutate({
      mutation: mutationCategoryDelete,
      variables: { id: id },
      fetchPolicy: "no-cache"
    });
  }
}
