import express from "express";

import { createUser, getUserByEmail } from "../models";
import { authentication, random } from "../helpers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { get, merge } from "lodash";
import { getUserById } from "../models";
import { getUserByUsername } from "../models/AdminModel";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = req.headers["authorization"];
    console.log(token, "XXX");
    const secretKey = process.env.SECRET;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json("Unauthorized user");
    }

    const sessionToken = token.split(" ")[1];

    try {
      const decoded = (await jwt.verify(sessionToken, secretKey)) as JwtPayload;

      // Check if the token has expired
      const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
      if (decoded.exp && decoded.exp < currentTimestamp) {
        return res.status(401).json("Token has expired");
      }

      if (decoded.iat && decoded.iat > currentTimestamp) {
        return res.status(401).json("INvalid Token");
      }

      // Fetch user information based on the decoded userId
      const existingUser = await getUserById(decoded.userId);

      if (!existingUser) {
        return res.status(403).json("Invalid session token");
      }

      merge(req, { identity: existingUser }); // Attach user information to the request object

      return next(); // Move to the next middleware in the chain
    } catch (error) {
      return res.status(400).json({ ...error, another: "Sample" });
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  const secretKey = process.env.SECRET;
  try {
    const { username, password } = req.body;
    console.log(username, "&&", password, req.body);
    if (!username || !password) {
      return res.status(400).json({ message: "Kulang Input" });
    }

    console.log("here1");

    const user = await getUserByUsername(username).select(
      "+authentication.salt +authentication.password"
    );
    console.log(user, "hhhhfhgh");
    if (!user) {
      return res.status(400).json({ ErrUser: true });
    }

    const expectedHash = authentication(user!.authentication!.salt!, password);

    if (user?.authentication?.password! != expectedHash) {
      return res.status(403).json({ ErrPass: true });
    }

    // Session token creation
    // const maxAge = 1 * 60 * 60; // days - hours - min - seconds
    const sessionToken = jwt.sign({ userId: user!._id }, secretKey, {
      expiresIn: "1hr",
    });
    user!.authentication!.sessionToken = sessionToken;

    await user!.save();

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "MALI" });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username)
      return res.status(400).json({ msg: "Incomplete details" });

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.status(400).json({ msg: "Email already in use." });
    }

    const salt = random();
    const user = await createUser({
      email: email,
      username: username,
      authentication: { salt: salt, password: authentication(salt, password) },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};
