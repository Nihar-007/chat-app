import { register, verifyEmail, login } from "../../controllers/auth.controller.js"

const req = {}

const res = {
    status: (statusCode) => {
        return {
            json: (data) => {
                return {statusCode, data}
            },
        };
    },
};

const Query = {
    async users() {
        return await User.find()
    },
    user: async (_, { id }) => {
        const req = { params: { id}}
        const response = "AS"
        
        if (response.statusCode === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    },
}

const Mutation = {
    createUser: async (_, { name, phno, email, password}) => {
        const req = { body: { name, phno, email, password }}
        const response = await register(req,res)
        
        if(response.statusCode === 200) return response.data
        else throw new Error(response.data.message)
    },
    verifyEmail: async (_, args) => {
        const req = {body: {email: args.email, otp: args.otp}}
        const response = await verifyEmail(req, res)

        if (response.statusCode === 201) return response.data.user
        else throw new Error(response.data.message)
    },
    login: async (_, {email, password}) => {
        const req = {body: {email, password}}
        const response = await login(req, res)
        
        if(response.statusCode === 200) return response.data.user
        else throw new Error(response.data.message)
    },
}

export const resolvers = { Query, Mutation }