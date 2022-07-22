import { Request, Response } from "express";
import { AuthRegister, JwtPayload } from "../dto";
import { comparePassword, hashPassword, jwtSign } from "../helpers/authHandler";
import { User } from "../models";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = <AuthRegister>req.body;

    const hash = await hashPassword(password);
    const checkUser = await User.findOne({ username });
    if (checkUser) {
      return res
        .status(409)
        .send({ msg: "error", error: "user already exists" });
    }
    const user = await User.create({
      username,
      password: hash,
    });
    const accessToken = jwtSign(user);

    res.status(201).send({ msg: "success", accessToken });
  } catch (error) {
    res.status(500).send({ msg: "error", error: "something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = <AuthRegister>req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).send({ msg: "error", error: "user not found" });

    const match = await comparePassword(user.password, password);

    if (!match)
      return res
        .status(403)
        .send({ msg: "error", error: "user or password doesn't match" });

    const accessToken = jwtSign(user);

    res.status(201).send({ msg: "success", accessToken });
  } catch (error) {
    res.status(500).send({ msg: "error", error: "something went wrong" });
  }
};

const authConroller = {
  register,
  login,
};

export default authConroller;
