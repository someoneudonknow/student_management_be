const app = require("./app/app")
const { app: { host, port } } = require("./configs/app.config")
const logger = require("./helpers/logger")

const server = app.listen(port, () => {
  logger("info", `Start listening on::${port}`)
})

