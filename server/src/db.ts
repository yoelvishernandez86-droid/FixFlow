import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "172.25.96.1",
  database: "fixflow",
  password: "anilorak",
  port: 5432,
});
