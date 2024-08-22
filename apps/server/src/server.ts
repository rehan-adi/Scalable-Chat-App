import http from "http";
import express, { Request, Response } from "express";

const init = () => {
  const app = express();
  const server = http.createServer(app);
  const port = process.env.PORT || 4000;

  app.get("/", (req: Request, res: Response) => {
    res.json({ success: true, message: "OK" });
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

init();
