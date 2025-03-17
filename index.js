import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import couponRouter from "./routes/couponRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

dotenv.config("./.env");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "token",
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/reviews", reviewRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
