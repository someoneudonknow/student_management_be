const configs = {
  development: {
    app: {
      host: process.env.APP_HOST_DEV ?? "localhost",
      port: process.env.APP_PORT_DEV ?? 3054,
      pepper: process.env.APP_PEPPER
    },
    clientUrl: process.env.CLIENT_URL_DEV ?? "",
    db: {
      host: process.env.DB_HOST_DEV ?? "",
      port: process.env.DB_PORT_DEV ?? 3306,
      pass: process.env.DB_PASS_DEV ?? "root",
      user: process.env.DB_USER_DEV ?? "root",
      name: process.env.DB_NAME_DEV ?? "student_management_dev",
    },
    redis: {
      host: process.env.REDIS_HOST_DEV ?? "localhost",
      port: process.env.REDIS_PORT_DEV ?? "6379",
    },
    mail: {
      service: process.env.MAIL_SERVICE_DEV ?? "",
      user: process.env.MAIL_USER_DEV ?? "",
      pass: process.env.MAIL_PASS_DEV ?? "",
      host: process.env.MAIL_HOST_DEV ?? "",
      port: process.env.MAIL_PORT_DEV ?? ""
    }
  },
  production: {
    app: {
      host: process.env.APP_HOST_PROD ?? "localhost",
      port: process.env.APP_PORT_PROD ?? 3056,
      pepper: process.env.APP_PEPPER
    },
    clientUrl: process.env.CLIENT_URL_PROD ?? "",
    db: {
      host: process.env.DB_HOST_PROD ?? "",
      port: process.env.DB_PORT_PROD ?? 3306,
      pass: process.env.DB_PASS_PROD ?? "root",
      user: process.env.DB_USER_PROD ?? "root",
      name: process.env.DB_NAME_PROD ?? "student_management_prod",
    },
    redis: {
      host: process.env.REDIS_HOST_PROD ?? "localhost",
      port: process.env.REDIS_PORT_PROD ?? "6379",
    },
    mail: {
      service: process.env.MAIL_SERVICE_PROD ?? "",
      user: process.env.MAIL_USER_PROD ?? "",
      pass: process.env.MAIL_PASS_PROD ?? "",
      host: process.env.MAIL_HOST_PROD ?? "",
      port: process.env.MAIL_PORT_PROD ?? ""
    }
  }
};

const env = process.env.NODE_ENV ?? "development";

module.exports = configs[env];
