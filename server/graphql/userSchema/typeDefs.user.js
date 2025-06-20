export const typeDefs = `#graphql
    type User{
        id: ID!
        name: String!
        phno: String!
        email: String!
        password: String!
        friends: [User!]
        friendRequests: [User!]
    }

    type MessageResponse{
        message: String!
    }
`