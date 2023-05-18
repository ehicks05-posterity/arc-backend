/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    DateTime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    DateTime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  createCommentInput: { // input type
    content: string; // String!
    level?: number | null; // Int
    parentCommentId?: string | null; // String
    postId: string; // String!
  }
  createPostInput: { // input type
    content?: string | null; // String
    link?: string | null; // String
    title: string; // String!
  }
  createUserCommentVoteInput: { // input type
    commentId: string; // String!
    direction: NexusGenEnums['Direction']; // Direction!
  }
  createUserPostVoteInput: { // input type
    direction: NexusGenEnums['Direction']; // Direction!
    postId: string; // String!
  }
  updateCommentInput: { // input type
    content: string; // String!
    id: string; // ID!
  }
  updatePostInput: { // input type
    content: string; // String!
    id: string; // ID!
  }
}

export interface NexusGenEnums {
  CommentSort: "BEST" | "NEW" | "TOP"
  Direction: "DOWN" | "UP"
  Sort: "HOT" | "NEW" | "TOP"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Comment: { // root type
    authorId: string; // String!
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    deleted: boolean; // Boolean!
    id: string; // ID!
    level: number; // Int!
    parentCommentId?: string | null; // String
    postId: string; // String!
    score: number; // Float!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Mutation: {};
  Post: { // root type
    authorId: string; // String!
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    deleted: boolean; // Boolean!
    id: string; // ID!
    link: string; // String!
    score: number; // Float!
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Query: {};
  User: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  UserCommentVote: { // root type
    commentId: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    direction: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: string; // String!
  }
  UserPostVote: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    direction: number; // Int!
    postId: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userId: string; // String!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Comment: { // field return type
    author: NexusGenRootTypes['User']; // User!
    authorId: string; // String!
    comments: NexusGenRootTypes['Comment'][]; // [Comment!]!
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    deleted: boolean; // Boolean!
    id: string; // ID!
    level: number; // Int!
    netVotes: number; // Int!
    parentComment: NexusGenRootTypes['Comment'] | null; // Comment
    parentCommentId: string | null; // String
    post: NexusGenRootTypes['Post']; // Post!
    postId: string; // String!
    score: number; // Float!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userVote: NexusGenRootTypes['UserCommentVote'] | null; // UserCommentVote
  }
  Mutation: { // field return type
    adminNuke: string | null; // String
    adminSeed: string | null; // String
    createComment: NexusGenRootTypes['Comment'] | null; // Comment
    createPost: NexusGenRootTypes['Post'] | null; // Post
    createUserCommentVote: NexusGenRootTypes['Comment'] | null; // Comment
    createUserPostVote: NexusGenRootTypes['Post'] | null; // Post
    deleteComment: NexusGenRootTypes['Comment'] | null; // Comment
    deletePost: NexusGenRootTypes['Post'] | null; // Post
    deleteUser: NexusGenRootTypes['User'] | null; // User
    deleteUserCommentVote: NexusGenRootTypes['Comment'] | null; // Comment
    deleteUserPostVote: NexusGenRootTypes['Post'] | null; // Post
    setUsername: string | null; // String
    updateComment: NexusGenRootTypes['Comment'] | null; // Comment
    updatePost: NexusGenRootTypes['Post'] | null; // Post
  }
  Post: { // field return type
    author: NexusGenRootTypes['User']; // User!
    authorId: string; // String!
    commentCount: number; // Int!
    comments: NexusGenRootTypes['Comment'][]; // [Comment!]!
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    deleted: boolean; // Boolean!
    id: string; // ID!
    link: string; // String!
    netVotes: number; // Int!
    score: number; // Float!
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    userVote: NexusGenRootTypes['UserPostVote'] | null; // UserPostVote
  }
  Query: { // field return type
    getCommentById: NexusGenRootTypes['Comment'] | null; // Comment
    getComments: Array<NexusGenRootTypes['Comment'] | null> | null; // [Comment]
    getMe: NexusGenRootTypes['User'] | null; // User
    getPostById: NexusGenRootTypes['Post'] | null; // Post
    getPosts: NexusGenRootTypes['Post'][]; // [Post!]!
    getUser: NexusGenRootTypes['User'] | null; // User
    getUsers: Array<NexusGenRootTypes['User'] | null> | null; // [User]
  }
  User: { // field return type
    commentVotes: NexusGenRootTypes['UserCommentVote'][]; // [UserCommentVote!]!
    comments: NexusGenRootTypes['Comment'][]; // [Comment!]!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    postVotes: NexusGenRootTypes['UserPostVote'][]; // [UserPostVote!]!
    posts: NexusGenRootTypes['Post'][]; // [Post!]!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  UserCommentVote: { // field return type
    comment: NexusGenRootTypes['Comment']; // Comment!
    commentId: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    direction: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
    userId: string; // String!
  }
  UserPostVote: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    direction: number; // Int!
    post: NexusGenRootTypes['Post']; // Post!
    postId: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
    userId: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  Comment: { // field return type name
    author: 'User'
    authorId: 'String'
    comments: 'Comment'
    content: 'String'
    createdAt: 'DateTime'
    deleted: 'Boolean'
    id: 'ID'
    level: 'Int'
    netVotes: 'Int'
    parentComment: 'Comment'
    parentCommentId: 'String'
    post: 'Post'
    postId: 'String'
    score: 'Float'
    updatedAt: 'DateTime'
    userVote: 'UserCommentVote'
  }
  Mutation: { // field return type name
    adminNuke: 'String'
    adminSeed: 'String'
    createComment: 'Comment'
    createPost: 'Post'
    createUserCommentVote: 'Comment'
    createUserPostVote: 'Post'
    deleteComment: 'Comment'
    deletePost: 'Post'
    deleteUser: 'User'
    deleteUserCommentVote: 'Comment'
    deleteUserPostVote: 'Post'
    setUsername: 'String'
    updateComment: 'Comment'
    updatePost: 'Post'
  }
  Post: { // field return type name
    author: 'User'
    authorId: 'String'
    commentCount: 'Int'
    comments: 'Comment'
    content: 'String'
    createdAt: 'DateTime'
    deleted: 'Boolean'
    id: 'ID'
    link: 'String'
    netVotes: 'Int'
    score: 'Float'
    title: 'String'
    updatedAt: 'DateTime'
    userVote: 'UserPostVote'
  }
  Query: { // field return type name
    getCommentById: 'Comment'
    getComments: 'Comment'
    getMe: 'User'
    getPostById: 'Post'
    getPosts: 'Post'
    getUser: 'User'
    getUsers: 'User'
  }
  User: { // field return type name
    commentVotes: 'UserCommentVote'
    comments: 'Comment'
    createdAt: 'DateTime'
    id: 'ID'
    postVotes: 'UserPostVote'
    posts: 'Post'
    updatedAt: 'DateTime'
  }
  UserCommentVote: { // field return type name
    comment: 'Comment'
    commentId: 'String'
    createdAt: 'DateTime'
    direction: 'Int'
    updatedAt: 'DateTime'
    user: 'User'
    userId: 'String'
  }
  UserPostVote: { // field return type name
    createdAt: 'DateTime'
    direction: 'Int'
    post: 'Post'
    postId: 'String'
    updatedAt: 'DateTime'
    user: 'User'
    userId: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createComment: { // args
      input: NexusGenInputs['createCommentInput']; // createCommentInput!
    }
    createPost: { // args
      input: NexusGenInputs['createPostInput']; // createPostInput!
    }
    createUserCommentVote: { // args
      input: NexusGenInputs['createUserCommentVoteInput']; // createUserCommentVoteInput!
    }
    createUserPostVote: { // args
      input: NexusGenInputs['createUserPostVoteInput']; // createUserPostVoteInput!
    }
    deleteComment: { // args
      id?: string | null; // ID
    }
    deletePost: { // args
      id?: string | null; // ID
    }
    deleteUser: { // args
      id?: string | null; // ID
    }
    deleteUserCommentVote: { // args
      commentId?: string | null; // ID
    }
    deleteUserPostVote: { // args
      postId?: string | null; // ID
    }
    setUsername: { // args
      username?: string | null; // String
    }
    updateComment: { // args
      input: NexusGenInputs['updateCommentInput']; // updateCommentInput!
    }
    updatePost: { // args
      input: NexusGenInputs['updatePostInput']; // updatePostInput!
    }
  }
  Post: {
    comments: { // args
      commentSort?: NexusGenEnums['CommentSort'] | null; // CommentSort
    }
  }
  Query: {
    getCommentById: { // args
      id?: string | null; // ID
    }
    getPostById: { // args
      id?: string | null; // ID
    }
    getPosts: { // args
      sort?: NexusGenEnums['Sort'] | null; // Sort
    }
    getUser: { // args
      id?: string | null; // ID
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}