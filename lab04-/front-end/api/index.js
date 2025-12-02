const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");
const connectDB = require("./db");
const User = require("./models/User");
const Place = require("./models/Place");
const serverless = require("serverless-http");
const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000*60*60 },
}));

// MongoDB холболт
connectDB();

/* ========== USERS ========== */

// Signup
app.post("/api/users/signup", 
  [
    body("name").notEmpty().withMessage("Нэр заавал."),
    body("email").isEmail().withMessage("Зөв имэйл оруулна уу."),
    body("password").isLength({ min: 4 }).withMessage("Нууц үг дор хаяж 4 тэмдэгттэй байх ёстой."),
  ],
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { name, email, password, image } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(422)
        .json({ error: "Имэйл аль хэдийн бүртгэлтэй." });
    }

    const user = await User.create({
      name,
      email,
      password,
      image: image || null,
    });

    req.session.userId = user._id.toString();

    res.status(201).json({
      message: "Хэрэглэгч амжилттай бүртгэгдлээ.",
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Серверийн алдаа." });
  }
});

// Бүх хэрэглэгч (password-гүй)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email image");
    const safeUsers = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      image: u.image || null,
    }));
    res.json({ users: safeUsers });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Серверийн алдаа." });
  }
});

// Login
app.post("/api/users/login",
  [
    body("email").isEmail().withMessage("И-мэйл буруу."),
    body("password").notEmpty().withMessage("Нууц үг заавал."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ error: "Имэйл эсвэл нууц үг буруу." });
    }

    req.session.userId = user._id.toString();

    res.json({
      message: "Амжилттай нэвтэрлээ.",
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Серверийн алдаа." });
  }
});

app.post("/api/users/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Серверийн алдаа." });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Амжилттай гарлаа." });
  });
});


function checkAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(403).json({ error: "Энэ үйлдэлд нэвтэрсэн байх ёстой." });
  }
  next();
}

// Шинэ газар үүсгэх
app.post("/api/places", async (req, res) => {
  const {
    title,
    description,
    image,
    address,
    latitude,
    longtitude,
    creator,
  } = req.body;

  if (!title || !description || !image || !address || !creator) {
    return res.status(400).json({ error: "Мэдээлэл дутуу байна." });
  }

  try {
    const place = await Place.create({
      title,
      description,
      image,
      address,
      latitude,
      longtitude,
      creator,
    });

    res.status(201).json(place);
  } catch (err) {
    console.error("Create place error:", err);
    res.status(500).json({ error: "Серверийн алдаа." });
  }
});

// Бүх газар
app.get("/api/places", async (req, res) => {
  try {
    const places = await Place.find();
    res.json({ places });
  } catch (err) {
    console.error("Get all places error:", err);
    res.status(500).json({ error: "Серверийн алдаа." });
  }
});

// Нэг хэрэглэгчийн газрууд
app.get("/api/places/user/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const places = await Place.find({ creator: uid });
    res.json({ places });
  } catch (err) {
    console.error("Get user places error:", err);
    res.status(500).json({ error: "Серверийн алдаа." });
  }
});

// Газрын дэлгэрэнгүй
app.get("/api/places/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ error: "Oldsongui" });
    }
    res.json(place);
  } catch (err) {
    console.error("Get place by id error:", err);
    res.status(500).json({ error: "Серверийн алдаа." });
  }
});

// Газрын мэдээлэл засах
app.patch("/api/places/:id", async (req, res) => {
  try {
    const updated = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ error: "Газрын ID олдсонгүй." });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update place error:", err);
    res.status(500).json({ error: "Серверийн алдаа." });
  }
});

// Газрыг устгах
app.delete("/api/places/:id", async (req, res) => {
  try {
    const deleted = await Place.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Газрын ID олдсонгүй." });
    }

    res.json({ message: "Амжилттай устлаа!" });
  } catch (err) {
    console.error("Delete place error:", err);
    res.status(500).json({ error: "Серверийн алдаа." });
  }
});

/* ========== SERVER START ========== */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 
export const handler = serverless(app);