import React from "react";
import { Link } from "react-router-dom";
import { users } from "../data/dummyData.js";
import { onImageError } from "../utils/imgFallback.js";

export default function Home() {
  return (
    <div className="container">
      <h2 className="page-title">Хэрэглэгчдийн жагсаалт</h2>
      <div className="grid">
        {users.map((u) => (
          <div key={u.id} className="card">
            <div className="card-row">
              <img className="rounded" src={u.image} width="56" height="56" alt={u.name} onError={onImageError} referrerPolicy="no-referrer" />
              <div style={{flex:1}}>
                <div className="title">{u.name}</div>
                <div className="muted">ID: {u.id}</div>
              </div>
              <Link className="btn btn-primary" to={`/${u.id}/places`}>Газрууд</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}