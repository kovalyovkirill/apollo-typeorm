import {createConnection, Connection} from "typeorm";

export const dbInit = (): { connection: Promise<Connection> } => {
  const connection = createConnection();

  return { connection };
};


