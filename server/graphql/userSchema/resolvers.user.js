import { register, verifyEmail, login } from "../../controllers/auth.controller.js"

const req = {}

const resetRes = () => {
  res.statusCode = null;
  res.data = null;
};

let res = {
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
        resetRes()
        const req = { body: { name, phno, email, password }}
        const response = await register(req,res)
        if(response.statusCode === 200) return {message: response?.message}
        else throw new Error(response.data?.message)
    },
    verifyEmail: async (_, args) => {
        const req = {body: {email: args.email, otp: args.otp}}
        const response = await verifyEmail(req, res)

        if (response.statusCode === 201) return response?.user
        else throw new Error(response?.message)
    },
    login: async (_, {email, password}, context) => {
        try {
            const {req, res} = context
            req.body =  {email, password}
            const response = await login(req, res)
            res.cookie("uid", response.token, { 
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                path: "/",
                sameSite: "None",
                secure: true,
                // sameSite: process.env.ENVIRONMENT === "production" ? "None" : "Lax",
                // secure: process.env.ENVIRONMENT !== "development"
            })
            // console.log("Response from login resolver: ", res)
            return response?.user
            //if(response.statusCode === 200) return response?.user
        } catch (error) {
            throw new Error(response.data.message)
        }
    },  
}

export const resolvers = { Query, Mutation }