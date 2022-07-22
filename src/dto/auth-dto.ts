export interface AuthRegister {
  username: string;
  password: string;
}

export interface JwtPayload {
  _id: string;
  username: string;
}
