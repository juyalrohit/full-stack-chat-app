import jsonwebtoken from 'jsonwebtoken';

// You don't need to import cookie-parser here; it's used as middleware in Express app setup

export const generateToken = async (userId, res) => {
    const token = jsonwebtoken.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    // Set cookie on the response object, not request
    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // milliseconds
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development', // spelling fix
    });

    return token;
};
