import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { places as seed } from "../data/dummyData.js";
import { onImageError } from "../utils/imgFallback.js";

function getPlaces() {
  const ls = JSON.parse(localStorage.getItem("places") || "[]");
  return [...seed, ...ls];
}

export default function PlaceDetail() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const list = getPlaces();
  const place = list.find((p) => String(p.id) === String(pid));

  if (!place) return <p>Газрын мэдээлэл олдсонгүй.</p>;

  const handleDelete = () => {
    const fromLS = JSON.parse(localStorage.getItem("places") || "[]");
    const updated = fromLS.filter(p => String(p.id) !== String(pid));
    localStorage.setItem("places", JSON.stringify(updated));
    alert("Устгалаа (LocalStorage дахь таны нэмсэн зүйлсээс).");
    navigate(-1);
  };

  return (
    <div className="container">
      <img className="detail-image" src={place.image} alt={place.title} onError={onImageError} referrerPolicy="no-referrer" />
      <h2 className="page-title">{place.title}</h2>
      <p>{place.description}</p>
      <p><b>Хаяг:</b> {place.address}</p>
      {(place.latitude || place.longitude) && (
        <p><b>Координат:</b> {place.latitude} , {place.longitude}</p>
      )}
      <div className="detail-actions">
        <button className="btn" onClick={()=>navigate(-1)}>Буцах</button>
        <button className="btn btn-danger" onClick={handleDelete}>Устгах</button>
        <button className="btn btn-secondary" onClick={()=>navigate(`/places/${pid}/edit`)}>Засах</button>
      </div>
    </div>
  );
}