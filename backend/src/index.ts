import express from "express";
import cookieParser from "cookie-parser"; // parses a very long cookie string(separated by semicolons => see in network Headers) and gets you an object
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken"; // JWTPayload is a type of object JWT
import path from "path"; // A library that lets you concatenate paths eg. path.join(__dirname, 'public')

const JWT_SECRET = "test123";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true, // basically means allow the server to be able to set cookies(credentials) on this specific origin
    origin: "http://localhost:5173",
  })
);

app.post("/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // do db validations, fetch id of user from db
  const token = jwt.sign(
    {
      id: 1,
    },
    JWT_SECRET
  );
  res.cookie("token", token);
  // this will put the cookie in the set-cookie header
  res.send("Logged in!");
});

app.get("/user", (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  // Get email of the user from the database
  res.send({
    userId: decoded.id,
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "/");
  // can also do res.clearCookie("token")
  res.json({
    message: "Logged out!",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/index.html"));
});

app.listen(3000);
