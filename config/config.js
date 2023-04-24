module.exports = {
  DATABASE: {
    NAME: process.env.DATABASE_NAME,
    USER: process.env.DATABASE_USER,
    PASSWORD: process.env.DATABASE_PASSWORD,
    HOST: process.env.DATABASE_HOST,
    PORT: process.env.DATABASE_PORT,
    DIALECT: process.env.DATABASE_DIALECT,
    SEQUELIZE_ALTER: process.env.DATABASE_DATABASE_SEQUELIZE_ALTERNAME,
    CHARSET: process.env.DATABASE_CHARSET,
    COLLATE: process.env.DATABASE_COLLATE
  },
  SERVER_PORT: process.env.SERVER_PORT,
  DOMAIN_URL: process.env.DOMAIN_URL,

  SWAGGER_TITLE: process.env.SWAGGER_TITLE,
  SWAGGER_DOMAIN_URL: process.env.SWAGGER_DOMAIN_URL,

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),

  VALID_AUTH_TYPES: ['admin']
};
