import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { places as seed } from "../data/dummyData.js";
import { onImageError } from "../utils/imgFallback.js";
import "./EditPlace.css"; 

function getPlaces() {
  const ls = JSON.parse(localStorage.getItem("places") || "[]");
  return [...seed, ...ls];
}

export default function EditPlace() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "", description: "", address: "",
    latitude: "", longitude: "", image: ""
  });

  useEffect(() => {
    const all = getPlaces();
    const current = all.find((p) => String(p.id) === String(pid));
    if (current) setFormData({
      title: current.title || "",
      description: current.description || "",
      address: current.address || "",
      latitude: current.latitude || "",
      longitude: current.longitude || "",
      image: current.image || ""
    });
  }, [pid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fromLS = JSON.parse(localStorage.getItem("places") || "[]");
    const updated = fromLS.map((p) =>
      String(p.id) === String(pid) ? { ...p, ...formData } : p
    );
    localStorage.setItem("places", JSON.stringify(updated));
    alert("Газрын мэдээлэл шинэчлэгдлээ!");
    navigate(`/places/${pid}`);
  };

  return (
    <div className="edit-page">
      <h2 className="page-title">Газрын мэдээлэл засах</h2>

      <div className="card">
        <form className="edit-form" onSubmit={handleSubmit}>
          <label>
            Гарчиг:
            <input name="title" value={formData.title} onChange={handleChange} required />
          </label>

          <label>
            Тайлбар:
            <input name="description" value={formData.description} onChange={handleChange} />
          </label>

          <label className="span-2">
            Хаяг:
            <input name="address" value={formData.address} onChange={handleChange} />
          </label>

          <label>
            Өргөрөг:
            <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} />
          </label>

          <label>
            Уртраг:
            <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} />
          </label>

          <label className="span-2">
            Зурагны линк:
            <input name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
          </label>

          {formData.image && (
            <img className="preview-image" src={formData.image} alt="Preview" onError={onImageError} />
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Буцах</button>
            <button type="submit" className="btn btn-primary">Хадгалах</button>
          </div>
        </form>
      </div>
    </div>
  );
}
