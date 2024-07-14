import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { requestMiddleware } from "./middlewares/middleware";
import playerRoutes from "./features/players/playersRouter";
import gameRoutes from "./features/games/gamesRouter";
import moveRoutes from "./features/moves/movesRouter";

const app = new OpenAPIHono();

app.all().use(
  "*",
  cors({
    origin: [
      "https://related-awake-shark.ngrok-free.app",
      "http://localhost:3000",
      "https://rnibg-213-214-42-42.a.free.pinggy.link",
      "https://rnkgs-213-214-42-42.a.free.pinggy.link",
    ],
    allowHeaders: [
      "Origin",
      "Content-Type",
      "authorization",
      "Authorization",
      "Accept",
      "Accept-Encoding",
      "Accept-Language",
      "Connection",
      "Host",
      "Origin",
      "Referer",
    ],
    allowMethods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use("*", requestMiddleware);

app.route("/", playerRoutes);
app.route("/", gameRoutes);
app.route("/", moveRoutes);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "API",
  },
});
app.get("/ui", swaggerUI({ url: "/doc" }));

export default {
  port: 3001,
  fetch: app.fetch,
  app: app,
};
