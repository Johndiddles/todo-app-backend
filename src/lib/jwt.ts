import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const signToken = (email: string, id: string) => {
  return jwt.sign(
    { email, id, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    JWT_SECRET_KEY!,
    { algorithm: "HS256" }
  );
};

export const decodeToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET_KEY!) as {
    email: string;
    id: string;
    exp: number;
    iat: number;
  };

  return decoded;
};
