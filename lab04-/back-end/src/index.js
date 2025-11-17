const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
const dataFile = path.join(__dirname, "../data/places.json");
function readPlaces() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]"); 
  }
  const raw = fs.readFileSync(dataFile);
  return JSON.parse(raw);
}
function writePlaces(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}
app.post("/api/places", (req, res) => {
    const  { title, description, image, address, latitude, longtitude, creator} = req.body;
    if (!title || !description || !image || !address || !creator){
        return res.status(400).json({ error: "Мэдээлэл дутуу байна." });
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

app.get("/api/places", (req, res) => {
    const places = readPlaces();
    res.json(places);
});

app.get("/api/places/:id", (req, res) => {
  const places = readPlaces();
  const place = places.find(p => p.id === req.params.id);

  if (!place) {
    return res.status(404).json({ error: "Oldsongui" });
  }

  res.json(place);
});
app.delete("/api/places/:id", (req, res) => {
  const places = readPlaces();
  const filtered = places.filter(p => p.id !== req.params.id);

  writePlaces(filtered);
  res.json({ message: "Амжилттай устлаа!" });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
