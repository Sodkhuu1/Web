import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onImageError } from "../utils/imgFallback.js";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/users`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Хэрэглэгчдийн жагсаалт авахад алдаа гарлаа.");
        }

        setUsers(data.users || []);
      } catch (err) {
        console.error("Fetch users error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h2 className="page-title">Хэрэглэгчид</h2>

      {loading && <p className="muted">Ачаалж байна...</p>}

      {error && (
        <p className="muted" style={{ color: "red" }}>
          Алдаа: {error}
        </p>
      )}

      {!loading && !error && users.length === 0 && (
        <p className="muted">Одоогоор бүртгэгдсэн хэрэглэгч алга байна.</p>
      )}

      <div className="grid">
        {users.map((u) => (
          <div key={u.id} className="card">
            <div className="card-row" style={{ alignItems: "center" }}>
              <img
                className="rounded"
                src={
                  u.image ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(u.name || u.email)
                }
                width="64"
                height="64"
                alt={u.name}
                onError={onImageError}
                referrerPolicy="no-referrer"
              />
              <div style={{ marginLeft: 12 }}>
                <div className="title">{u.name || "Нэргүй хэрэглэгч"}</div>
                <div className="muted">{u.email}</div>
                {/* Хэрвээ тухайн хэрэглэгчийн газрууд руу шууд орох линк */}
                <div style={{ marginTop: 8 }}>
                  <Link className="btn" to={`/${u.id}/places`}>
                    Түүний газрууд
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
