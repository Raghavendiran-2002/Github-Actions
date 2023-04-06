require('dotenv').config()

module.exports = {
    server: {
        port: process.env.PORT || 8000
    },
    database: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'sabarish22',
        dbName: process.env.DB_NAME || 'ks'
    }
};