import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <div className="nav">
      <div className="nav-inner">
        <Link to="/" style={{fontWeight: 800}}>Газрын Сан</Link>
        <Link to="/places">Бүх газар</Link>
        {!user && <Link to="/authenticate">Нэвтрэх</Link>}
        {user && <Link to={`/${user.id}/places`}>Миний газрууд</Link>}
        {user && <Link to="/places/new">Газар нэмэх</Link>}
        <div className="nav-spacer">
          {user ? (
            <>
              <span className="muted" style={{marginRight: 6}}>{user.name}</span>
              <button className="btn" onClick={logout}>Гарах</button>
            </>
          ) : <span className="muted">Зочин</span>}
        </div>
      </div>
    </div>
  )
}