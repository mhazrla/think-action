export enum UserAccountTypes {
  Public = "public",
  Private = "private",
}

export interface UserEntityInterface {
  _id?: string;
  username?: string;
  acc_type?: UserAccountTypes;
  email?: string;
  password?: string;
  name?: string;
  googleId?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
}

export class UserEntity implements UserEntityInterface {
  public _id?: string;
  public username?: string;
  public acc_type?: UserAccountTypes;
  public email?: string;
  public password?: string;
  public name?: string;
  public googleId?: string;
  public bio?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public token?: string;

  constructor(user: UserEntityInterface) {
    this._id = user._id;
    this.username = user.username;
    this.acc_type = user.acc_type;
    this.email = user.email;
    this.password = user.password;
    this.name = user.name;
    this.googleId = user.googleId;
    this.bio = user.bio;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.token = user.token;
  }
}
