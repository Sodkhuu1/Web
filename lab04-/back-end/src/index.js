const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
const placesFile = path.join(__dirname, "../data/places.json");
const usersFile = path.join(__dirname, '../data/users.json');
function ensureFile(filePath){
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }
}

function readJson(filePath) {
  ensureFile(filePath);
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readPlaces() {
  return readJson(placesFile);
}
function writePlaces(data) {
  writeJson(placesFile, data);
}

function readUsers() {
  return readJson(usersFile);
}
function writeUsers(data) {
  writeJson(usersFile, data);
}
app.post("/api/users/signup", (req, res) => {
    const  { name, email, password, image} = req.body;
    if (!name || !email || !password){
        return res.status(400).json({ error: "Нэр, имэйл, нууц үг заавал." });
    }
    const users = readUsers();
    const existing = users.find(u => u.email === email);
    if (existing) {
        return res.status(422).json({ error: "Имэйл аль хэдийн бүртгэлтэй." });
    }
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        image: image || null
    };

    users.push(newUser);
    writeUsers(users);
    res.status(201).json({
        message: "Хэрэглэгч амжилттай бүртгэгдлээ.",
        userId: newUser.id,  
        name: newUser.name,
        email: newUser.email
    });
});

app.get("/api/users", (req, res) => {
    const users = readUsers();
    const safeUsers = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image || null
    }));
    res.json({ users: safeUsers });
});

app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Имэйл эсвэл нууц үг буруу." });
  }
  res.json({
    message: "Амжилттай нэвтэрлээ.",
    userId: user.id,
    name: user.name,
    email: user.email
  });
});
app.post('/api/places', (req, res) => {
  const { title, description, image, address, latitude, longtitude, creator } = req.body;

  if (!title || !description || !image || !address || !creator) {
    return res.status(400).json({ error: 'Мэдээлэл дутуу байна.' });
  }

  const places = readPlaces();
  const newPlace = {
    id: Date.now().toString(),
    title,
    description,
    image,
    address,
    latitude,
    longtitude,
    creator
  };

  places.push(newPlace);
  writePlaces(places);

  res.status(201).json(newPlace);
});
app.get('/api/places/user/:uid', (req, res) => {
  const uid = req.params.uid;
  const places = readPlaces();
  const userPlaces = places.filter(p => p.creator === uid);
  res.json({ places: userPlaces });
});

app.get("/api/places/:id", (req, res) => {
  const places = readPlaces();
  const place = places.find(p => p.id === req.params.id);

  if (!place) {
    return res.status(404).json({ error: "Oldsongui" });
  }

  res.json(place);
});


app.get("/api/places", (req, res) => {
  const places = readPlaces();
  res.json({ places }); 
});

app.patch('/api/places/:id', (req, res) => {
  const placeId = req.params.id;
  const { title, description, image, address, latitude, longtitude } = req.body;

  const places = readPlaces();
  const index = places.findIndex(p => p.id === placeId);

  if (index === -1) {
    return res.status(404).json({ error: 'Газрын ID олдсонгүй.' });
  }

  const updated = { ...places[index] };

  if (title !== undefined)       updated.title = title;
  if (description !== undefined) updated.description = description;
  if (image !== undefined)       updated.image = image;
  if (address !== undefined)     updated.address = address;
  if (latitude !== undefined)    updated.latitude = latitude;
  if (longtitude !== undefined)  updated.longtitude = longtitude;

  places[index] = updated;
  writePlaces(places);

  res.json(updated);
});

app.delete('/api/places/:id', (req, res) => {
  const places = readPlaces();
  const filtered = places.filter(p => p.id !== req.params.id);

  if (filtered.length === places.length) {
    return res.status(404).json({ error: 'Газрын ID олдсонгүй.' });
  }

  writePlaces(filtered);
  res.json({ message: 'Амжилттай устлаа!' });
});

// ##########################
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
