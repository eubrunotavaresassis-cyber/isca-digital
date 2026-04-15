import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { API_URL } from '../config'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  async function handleRegister(e){
    e.preventDefault()
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
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
        <h2>Cadastrar — PLAN INVEST</h2>
        <form onSubmit={handleRegister}>
          <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn primary" type="submit">Criar conta</button>
        </form>
      </div>
    </div>
  )
}
