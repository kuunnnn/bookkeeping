export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type User = {
  __typename?: "User";
  email: Scalars["String"];
  id: Scalars["Int"];
  name: Scalars["String"];
  phone: Scalars["String"];
  avatar?: Maybe<Scalars["String"]>;
};

export type Currency = {
  __typename?: "Currency";
  code: Scalars["String"];
  id: Scalars["Int"];
  name: Scalars["String"];
  symbol: Scalars["String"];
};

export type Record = {
  __typename?: "Record";
  id: Scalars["Int"];
  money: Scalars["Float"];
  remark?: Maybe<Scalars["String"]>;
  date: Scalars["String"];
  categoryName: Scalars["String"];
  accountName: Scalars["String"];
  type: Scalars["String"];
  userId: Scalars["Int"];
  accountId: Scalars["Int"];
  categoryId: Scalars["Int"];
  user: User;
  account: Account;
  category: Category;
};

export type Category = {
  __typename?: "Category";
  id: Scalars["Int"];
  nums: Scalars["Int"];
  type: Scalars["String"];
  name: Scalars["String"];
  userId: Scalars["Int"];
  user: User;
  recordList: Array<Maybe<Record>>;
};

export type Account = {
  __typename?: "Account";
  id: Scalars["Int"];
  expenses: Scalars["String"];
  incomes: Scalars["String"];
  initialAmount: Scalars["String"];
  isDefault: Scalars["Int"];
  name: Scalars["String"];
  currencyName: Scalars["String"];
  currencyCode: Scalars["String"];
  currencySymbol: Scalars["String"];
  userId: Scalars["Int"];
  currencyId: Scalars["Int"];
  user: User;
  currency: Currency;
  recordList: Array<Maybe<Record>>;
};

export type QuerRecord = {
  pageNum?: Maybe<Scalars["Int"]>;
  pageSize?: Maybe<Scalars["Int"]>;
  categoryId?: Maybe<Scalars["Int"]>;
  year?: Maybe<Scalars["Int"]>;
  month?: Maybe<Scalars["Int"]>;
  day?: Maybe<Scalars["Int"]>;
  accountId?: Maybe<Scalars["Int"]>;
  type?: Maybe<Scalars["String"]>;
};

export type Query = {
  __typename?: "Query";
  account?: Maybe<Account>;
  accountList: Array<Account>;
  category?: Maybe<Category>;
  categoryList: Array<Category>;
  currency?: Maybe<Currency>;
  currencyList: Array<Currency>;
  record?: Maybe<Record>;
  recordList: Array<Record>;
  user: User;
};

export type QueryAccountArgs = {
  id: Scalars["Int"];
};

export type QueryCategoryArgs = {
  id: Scalars["Int"];
};

export type QueryCategoryListArgs = {
  type: Scalars["String"];
};

export type QueryCurrencyArgs = {
  id: Scalars["Int"];
};

export type QueryRecordArgs = {
  id: Scalars["Int"];
};

export type QueryRecordListArgs = {
  param?: Maybe<QuerRecord>;
};

export type UpdateResult = {
  __typename?: "UpdateResult";
  ok: Scalars["Boolean"];
};

export type DeleteResult = {
  __typename?: "DeleteResult";
  ok: Scalars["Boolean"];
};

export type CreateResult = {
  __typename?: "CreateResult";
  id: Scalars["Int"];
};

export type Mutation = {
  __typename?: "Mutation";
  createAccount: CreateResult;
  createCategory: CreateResult;
  createRecord: CreateResult;
  deleteAccount: DeleteResult;
  deleteCategory: DeleteResult;
  deleteRecord: DeleteResult;
  updateAccount: UpdateResult;
  updateCategory: UpdateResult;
  updateRecord: UpdateResult;
  updateUserName: UpdateResult;
};

export type MutationCreateAccountArgs = {
  data: AccountAddAndUpdateInput;
};

export type MutationCreateCategoryArgs = {
  data: CategoryCreateInput;
};

export type MutationCreateRecordArgs = {
  data: RecordAddAndUpdateInput;
};

export type MutationDeleteAccountArgs = {
  id: Scalars["Int"];
};

export type MutationDeleteCategoryArgs = {
  id: Scalars["Int"];
};

export type MutationDeleteRecordArgs = {
  id: Scalars["Int"];
};

export type MutationUpdateAccountArgs = {
  id: Scalars["Int"];
  param: AccountAddAndUpdateInput;
};

export type MutationUpdateCategoryArgs = {
  id: Scalars["Int"];
  name: Scalars["String"];
};

export type MutationUpdateRecordArgs = {
  id: Scalars["Int"];
  param: RecordAddAndUpdateInput;
};

export type MutationUpdateUserNameArgs = {
  name: Scalars["String"];
};

export type AccountAddAndUpdateInput = {
  currencyId: Scalars["Int"];
  initialAmount: Scalars["Float"];
  isDefault: Scalars["Boolean"];
  name: Scalars["String"];
};

export type CategoryCreateInput = {
  type: Scalars["String"];
  name: Scalars["String"];
};

export type RecordAddAndUpdateInput = {
  accountId: Scalars["Int"];
  categoryId: Scalars["Int"];
  money: Scalars["Float"];
  type: Scalars["String"];
  remark?: Maybe<Scalars["String"]>;
  date: Scalars["String"];
};
