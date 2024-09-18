const app = require("./app/app")
const { app: { host, port } } = require("./configs/app.config")

const server = app.listen(port, () => {
  console.log(`Start listening on::${port}`)
})
