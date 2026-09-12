import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fixflow",
  password: "anilorak",
  port: 5432,
});
