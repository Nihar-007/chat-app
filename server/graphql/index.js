import { ApolloServer } from "@apollo/server";
import { userSchema }  from "./userSchema/index.js"

const context = ({ req }) => {
    const user = req.user
    return { user }
}

const createApolloServer = async () => {
    const gqlServer = new ApolloServer({
        typeDefs: `#graphql

            ${userSchema.typeDefs}

            type Query {
                hello: String
                ${userSchema.queries}
            }

            type Mutation {
                ${userSchema.mutations}
            }
        `,
        resolvers: {
            Query: {
                hello: () => "Hello world!",
                ...userSchema.resolvers.Query,
            },
            Mutation:{
                ...userSchema.resolvers.Mutation,
            }
        },
        persistedQueries: true,
        // context: ({req, res}) => ({req, res}),
        introspection: process.env.ENVIRONMENT === "development"
    })

    await gqlServer.start()
    return gqlServer
}

export default createApolloServer