import jwt from 'jsonwebtoken'

export const generateToken = async ( id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d'})

    res.cookie("uid", token, { 
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT === "production" ? "Strict" : "Lax", 
        secure: process.env.ENVIRONMENT !== "development"
    })

    return token
}