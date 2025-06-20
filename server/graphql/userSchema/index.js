import { typeDefs } from "./typeDefs.user.js"
import { resolvers } from "./resolvers.user.js"
import { queries } from "./queries.user.js"
import { mutations } from "./mutations.user.js"

export const userSchema = { typeDefs, resolvers, queries, mutations }