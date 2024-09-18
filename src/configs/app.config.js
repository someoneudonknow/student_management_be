const configs = {
  development: {
    app: {
      host: process.env.APP_HOST_DEV ?? "localhost",
      port: process.env.APP_HOST_PROD ?? 3054,
    },
    db: {
      host: process.env.DB_HOST_DEV ?? "",
      port: process.env.DB_PORT_DEV ?? "",
      pass: process.env.DB_PASS_DEV ?? "root",
      user: process.env.DB_USER_DEV ?? "root",
      name: process.env.DB_NAME_DEV ?? "student_management",
    },
  },
  production: {
    app: {
      host: process.env.APP_HOST_PROD ?? "localhost",
      port: process.env.APP_PORT_PROD ?? 3056,
    },
    db: {
      host: process.env.DB_HOST_PROD ?? "",
      port: process.env.DB_PORT_PROD ?? "",
      pass: process.env.DB_PASS_PROD ?? "root",
      user: process.env.DB_USER_PROD ?? "root",
      name: process.env.DB_NAME_PROD ?? "student_management",
    },
};

const env = process.env.NODE_ENV ?? "development";

module.exports = config[env];
