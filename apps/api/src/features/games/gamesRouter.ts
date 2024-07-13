import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { extractMiddleware } from "../../middlewares/middleware";

const collectionPath = "/games";
const detailPath = collectionPath + "/{id}";

