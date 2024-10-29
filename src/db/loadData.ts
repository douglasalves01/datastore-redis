import { readFileSync } from "fs";
import { conn } from "./db";
import path from "path";
export const runSQLDump = async () => {
  try {
    const sqlDump = readFileSync(
      path.join(__dirname, "../../DUMP.sql"),
      "utf8"
    );

    const sqlCommands = sqlDump
      .split(";")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd);

    for (const command of sqlCommands) {
      await conn.promise().query(command);
    }

    console.log("Dump executado com sucesso!");
  } catch (error) {
    console.error("Erro ao executar o dump:", error);
  }
};
