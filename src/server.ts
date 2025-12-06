import express, { Request, Response } from "express"
import app from "./app"
const port = 5000

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World niloy !')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
