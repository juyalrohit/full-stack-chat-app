import jsonwebtoken from 'jsonwebtoken';


export const generateToken = async (userId, res) => {
    const token = jsonwebtoken.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // milliseconds
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
    });

    return token;
};
