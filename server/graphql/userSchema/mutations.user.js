export const mutations = `#graphql
    createUser(name: String!, phno: String!, email: String!, password: String!): MessageResponse!
    verifyEmail(email: String!, otp: String!): User
    login(email: String!, password: String!): User
`