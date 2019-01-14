module.exports = () => {
    if (process.env.NODE_ENV !== 'production') {
        return {
            host: process.env.HOST || '127.0.0.1',
            port: process.env.PORT || 3000,
            dbConnection: 'mongodb://localhost/nuxAuthen',
            sessionExpiresIn: 60 * 60 * 24 * 7, //1 tuần
            authen: {
                jwtSecret: process.env.JWT_SECRET || "secret"
            }
        }
    } else {
        return {
            host: process.env.HOST || '127.0.0.1',
            port: process.env.PORT || 3000,
            sessionExpiresIn: 60 * 60 * 24 * 7, //1 tuần
            authen: {
                jwtSecret: process.env.JWT_SECRET || "secret"
            }
        }
    }
};