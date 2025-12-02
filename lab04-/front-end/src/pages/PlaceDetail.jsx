import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onImageError } from "../utils/imgFallback.js";

const API_BASE = import.meta.env.VITE_API_URL;

export default function PlaceDetail() {
  const { pid } = useParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Газрын мэдээллийг backend-ээс авах
  useEffect(() => {
    async function fetchPlace() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/places/${pid}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Газрын мэдээлэл авах үед алдаа гарлаа.");
        }

        setPlace(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (pid) {
      fetchPlace();
    }
  }, [pid]);

  // Устгах
  const handleDelete = async () => {
    if (!window.confirm("Энэ газрыг устгах уу?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/places/${pid}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Устгах үед алдаа гарлаа.");
      }

      alert(data.message || "Амжилттай устлаа.");
      // creator байвал тэр хэрэглэгчийн газрууд руу буцна, үгүй бол зүгээр history -1
      if (place && place.creator) {
        navigate(`/${place.creator}/places`, { replace: true });
      } else {
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p className="muted">Ачаалж байна...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p className="muted" style={{ color: "red" }}>
          Алдаа: {error}
        </p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="container">
        <p>Газрын мэдээлэл олдсонгүй.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <img
        className="detail-image"
        src={place.image}
        alt={place.title}
        onError={onImageError}
        referrerPolicy="no-referrer"
      />
      <h2 className="page-title">{place.title}</h2>
      <p>{place.description}</p>
      <p>
        <b>Хаяг:</b> {place.address}
      </p>

      {(place.latitude || place.longtitude) && (
        <p>
          <b>Координат:</b> {place.latitude} , {place.longtitude}
        </p>
      )}

      <div className="detail-actions">
        <button className="btn" onClick={() => navigate(-1)}>
          Буцах
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          Устгах
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/places/${pid}/edit`)}
        >
          Засах
        </button>
      </div>
    </div>
  );
}
