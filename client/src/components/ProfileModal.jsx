import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'

export default function ProfileModal({open, onClose}){
  const [profile, setProfile] = useState(null)
  const token = localStorage.getItem('pi_token')

  useEffect(()=>{
    if (!open) return
    fetch(`${API_URL}/api/auth/profile`, { headers:{ Authorization: 'Bearer '+token } })
      .then(r=>r.json()).then(d=>{ if (d.user) setProfile(d.user) })
  }, [open])

  if (!open) return null

  return (
    <div className="modal-overlay">
      <div className="modal card">
        <h3>Perfil</h3>
        {profile ? (
          <div style={{display:'grid',gap:8}}>
            <div><strong>Nome:</strong> {profile.name}</div>
            <div><strong>Email:</strong> {profile.email}</div>
            <div><strong>Criado em:</strong> {new Date(profile.created_at).toLocaleString()}</div>
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
              <button className="btn ghost" onClick={onClose}>Fechar</button>
            </div>
          </div>
        ) : (
          <div>Carregando...</div>
        )}
      </div>
    </div>
  )
}
