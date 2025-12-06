import express, { Request, Response } from "express"
import app from "./app"
import config from "./config"

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})
