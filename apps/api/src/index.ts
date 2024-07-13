import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { requestMiddleware } from "./middlewares/middleware";
import playerRoutes from "./features/players/playersRouter";
import gameRoutes from "./features/games/gamesRouter";

const app = new OpenAPIHono();

app.use("*",
    cors({
        origin: "*",
        allowHeaders: ["Origin", "Content-Type", "Authorization"],
        allowMethods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
    })
);

app.use("*", requestMiddleware);

app.route("/", playerRoutes);
app.route("/", gameRoutes);

app.doc("/doc", {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "API",
    }
});
app.get("/ui", swaggerUI({ url: "/doc" }));

export default {
    port: 3001,
    fetch: app.fetch,
    app: app,
};