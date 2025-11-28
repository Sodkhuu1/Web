import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onImageError } from "../utils/imgFallback.js";

const API_BASE = "http://localhost:5000";

export default function AllPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaces() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/places`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Газрын жагсаалт авахад алдаа гарлаа.");
        }

        setPlaces(data.places || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h2 className="page-title">Бүх газар</h2>
        <p className="muted">Ачаалж байна...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2 className="page-title">Бүх газар</h2>
        <p className="muted" style={{ color: "red" }}>
          Алдаа: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Бүх газар</h2>

      {places.length === 0 && (
        <p className="muted">Одоогоор газар бүртгэгдээгүй байна.</p>
      )}

      <div className="grid">
        {places.map((p) => (
          <div key={p.id} className="card">
            <div className="card-row" style={{ alignItems: "flex-start" }}>
              <img
                className="rounded"
                src={p.image}
                width="110"
                height="110"
                alt={p.title}
                onError={onImageError}
                referrerPolicy="no-referrer"
              />
              <div style={{ flex: 1 }}>
                <div className="title">{p.title}</div>
                <div className="muted">{p.address}</div>
                <div style={{ marginTop: 8 }}>
                  <Link className="btn" to={`/places/${p.id}`}>
                    Дэлгэрэнгүй
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
