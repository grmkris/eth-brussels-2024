import {migrateDB} from "../src/db/db";

migrateDB().then(() => {
    console.log("Database migrated");
})