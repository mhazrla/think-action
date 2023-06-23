import { UserEntityInterface } from "../user.entity.js";
import DatabaseConnection, { RetrieveOptionsInterface } from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

interface ResponseInterface extends UserEntityInterface {
  _id: string;
}

export class RetrieveUserRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "users");
  }

  public async handle(googleId: string, options?: RetrieveOptionsInterface): Promise<ResponseInterface> {
    const response: any = await this.databaseManager.retrieveAll(
      { fields: "", filter: { googleId }, page: 1, pageSize: 1, sort: "asc" },
      options
    );

    return response.data[0];
  }
}
