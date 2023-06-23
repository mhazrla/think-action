import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthUserRepository } from "../model/repository/auth.repository.js";
import { UserEntity } from "../model/user.entity.js";
import { validate } from "../validation/register.validation.js";
import DatabaseConnection, {
  CreateOptionsInterface,
  DocumentInterface,
  RetrieveOptionsInterface,
} from "@src/database/connection.js";

interface TokenPayload {
  userId: string;
}

export class AuthUserUseCase {
  private readonly tokenBlacklist: string[] = [];
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async register(document: DocumentInterface, options: CreateOptionsInterface) {
    try {
      // validate request body
      validate(document);
      const hashedPassword = hashSync(document.password, 10);

      // save to database
      const userEntity = new UserEntity({
        username: document.username,
        password: hashedPassword,
        email: document.email,
        name: document.name,
        bio: document.bio,
        googleId: document.googleId,
        acc_type: document.acc_type,
        createdAt: new Date(),
      });
      const response = await new AuthUserRepository(this.db).register(userEntity, options);

      return {
        acknowledged: response.acknowledged,
        _id: response._id,
      };
    } catch (error) {
      throw error;
    }
  }

  public async login(googleId: string, password: string, options?: RetrieveOptionsInterface): Promise<any> {
    try {
      const user = await new AuthUserRepository(this.db).findByGoogleId(googleId, options);
      if (!user || !compareSync(password, user.password as string)) {
        throw new Error("Invalid googleId or password");
      }
      return { user, token: this.generateToken(user) };
    } catch (error) {
      throw error;
    }
  }

  private generateToken(user: UserEntity): string {
    const payload: TokenPayload = { userId: user._id as string };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "30d" });
    return token;
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
  }

  public invalidateToken(token: string): void {
    this.tokenBlacklist.push(token);
  }

  public isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.includes(token);
  }
}
