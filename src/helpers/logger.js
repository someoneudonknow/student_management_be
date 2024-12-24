"use strict"

const colors = {
  default: "\x1b[0m",
  error: "\x1b[31m",
  success: "\x1b[32m",
  warn: "\x1b[33m",
  info: "\x1b[34m"
}

const prefix = {
  error: "❌ [ERROR]: ",
  success: "✅ [SUCCESS]: ",
  warn: "⚠ [WARN]: ",
  info: "🔵 [INFO]: "
}

const logger = (type, text) => {
  const availableTypes = ["success", "error", "warn", "info"]

  if (!availableTypes.includes(type)) {
    throw new Error(`Type ${type} is not a valid type`)
  }

  const logContent = `${prefix[type]}${text}`

  return console.log(`${colors[type]}${logContent}${colors.default}`)
}

module.exports = logger;
