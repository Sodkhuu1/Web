import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function NewPlace() {
  const [form, setForm] = useState({ title: "", description: "", image: "", address: "", latitude: "", longtitude: "" });
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Basic validation
    if (!form.title || !form.description || !form.address) {
      alert("Гарчиг, тайлбар, хаяг заавал!");
      return;
    }
    if (!/^https?:\/\//.test(form.image)) {
      alert("Зураг URL 'http(s)://' гэж эхэлсэн байх ёстой.");
      return;
    }
    try {
      const body = {
        ...form,
        creator: user.id,
      };
      const res = await fetch("http://localhost:3000/api/places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert("Серверийн алдаа: " + (err.error || res.status));
        return;
    }
    const saved = await res.json();
    console.log("Saved new place:", saved);
    setForm({
      title: "", description: "", image: "", address: "", latitude: "", longtitude: "",
    });
    alert("Амжилттай сервер дээр хадгалагдлаа!");
    navigate('/${user.id}/places', { replace: true});
  } catch (error) {
    console.error(error);
    alert("Сервертэй холбогдох үед алдаа гарлаа.");
  }
  };

  return (
    <div className="container">
      <h2 className="page-title">Газрын мэдээлэл нэмэх</h2>
      <form onSubmit={handleSubmit} className="form">
        <input className="input" name="title" placeholder="Гарчиг" value={form.title} onChange={handleChange} required />
        <input className="input" name="image" placeholder="Зураг URL" value={form.image} onChange={handleChange} required />
        <input className="input" name="address" placeholder="Хаяг" value={form.address} onChange={handleChange} required />
        <div className="row">
          <input className="input" name="latitude" placeholder="Өргөрөг" value={form.latitude} onChange={handleChange} />
          <input className="input" name="longtitude" placeholder="Уртраг" value={form.longtitude} onChange={handleChange} />
        </div>
        <textarea className="textarea" name="description" placeholder="Тайлбар" value={form.description} onChange={handleChange} rows={4} required />
        <div className="hint">Зураг URL нь http(s):// гэж эхэлсэн байх хэрэгтэй.</div>
        <button className="btn btn-primary" type="submit">Хадгалах</button>
      </form>
    </div>
  );
}