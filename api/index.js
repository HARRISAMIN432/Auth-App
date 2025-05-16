const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoute");
const authRouter = require('./controllers/authController.js')
dotenv.config();

mongoose
  .connect(process.env.MONGO, {
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRouter);
app.use('/api/auth', authRouter)
