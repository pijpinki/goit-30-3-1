const express = require("express");
const morgan = require("morgan");
const path = require("path");
const connection = require("./database/Connection");
const usersRouter = require("./routers/users");
const config = require("../config");

const app = express();

async function main() {
  await connection.connect();

  app.use(morgan("tiny"));
  app.use(express.urlencoded());
  app.use(express.json());

  app.use("/app", express.static(path.join(__dirname, "public")));
  app.use("/users", usersRouter);

  app.listen(config.port, (err) => {
    if (err) {
      return console.error(err);
    }

    console.info("server started at port", config.port);
  });

  process.on("SIGILL", () => {
    connection.close();
  });
}

main().catch(console.error);
