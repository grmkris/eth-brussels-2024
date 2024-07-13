import { z } from "@hono/zod-openapi";
import { SelectPlayer } from "../../db/playersStorage.db";

export const PlayersResponse = SelectPlayer;