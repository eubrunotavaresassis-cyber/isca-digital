import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { API_URL } from '../config'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  async function handleLogin(e){
    e.preventDefault()
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('pi_token', data.token)
      nav('/dashboard')
    } else {
      alert(data.error || 'Erro')
    }
  }

  return (
    <div className="page auth-page">
      <div className="card auth-card">
        <Logo />
        <h2>Entrar — PLAN INVEST</h2>
        <form onSubmit={handleLogin}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn primary" type="submit">Entrar</button>
        </form>
        <div className="muted">Ainda não tem conta? <Link to="/register">Cadastre-se</Link></div>
      </div>
    </div>
  )
}
