import jwt from 'jsonwebtoken'

export const generateToken = async ( id ) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d'})

    // if (res && typeof res.cookie === 'function') {
    // res.cookie("uid", token, { 
    //     maxAge: 24 * 60 * 60 * 1000,
    //     httpOnly: true,
    //     path: "/",
    //     sameSite: process.env.ENVIRONMENT === "production" ? "Strict" : "Lax", 
    //     secure: process.env.ENVIRONMENT !== "development"
    // })
    // console.log("cookie: ", id)
    // }
    return token
}