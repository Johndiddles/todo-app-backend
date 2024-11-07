import jwt from "jsonwebtoken";

export const signToken = (email: string) => {
  return jwt.sign(
    { data: email, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    "signasecuretoken",
    { algorithm: "HS256" }
  );
};
