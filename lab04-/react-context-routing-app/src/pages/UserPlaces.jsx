import React from "react";
import { useParams, Link } from "react-router-dom";
import { places as seed } from "../data/dummyData.js";
import { onImageError } from "../utils/imgFallback.js";

function getPlaces() {
  const ls = JSON.parse(localStorage.getItem("places") || "[]");
  return [...seed, ...ls];
}

export default function UserPlaces() {
  const { uid } = useParams();
  const userPlaces = getPlaces().filter((p) => String(p.creator) === String(uid));

  return (
    <div className="container">
      <h2 className="page-title">Хэрэглэгчийн газрууд</h2>
      {userPlaces.length === 0 && <p className="muted">Энэ хэрэглэгч одоогоор газар нэмээгүй байна.</p>}
      <div className="grid">
        {userPlaces.map((p) => (
          <div key={p.id} className="card">
            <div className="card-row" style={{alignItems:'flex-start'}}>
              <img className="rounded" src={p.image} width="110" height="110" alt={p.title} onError={onImageError} referrerPolicy="no-referrer" />
              <div style={{flex:1}}>
                <div className="title">{p.title}</div>
                <div className="muted">{p.address}</div>
                <div style={{marginTop:8}}>
                  <Link className="btn" to={`/places/${p.id}`}>Дэлгэрэнгүй</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}