import {onRequest} from "firebase-functions/v2/https";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
let app: any;
let handle: any;

const initNext = async () => {
  if (!app) {
    app = next({dev});
    handle = app.getRequestHandler();
    await app.prepare();
  }
  return {app, handle};
};

export const nextServer = onRequest(async (req, res) => {
  try {
    const {handle} = await initNext();
    await handle(req, res);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).send("Internal Server Error");
  }
});
