import { useState } from 'react'

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0A0A0A' }}>
      <div style={{ background:'#141414', border:'1px solid #2A2A2A', borderTop:'2px solid #C9A84C', borderRadius:12, padding:'2.5rem 2rem', width:340 }}>
        
        {/* LOGO */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <img
            src="/icon-512.png"
            alt="Krinas Tech Logo"
            style={{ width:110, height:110, objectFit:'contain', borderRadius:16, marginBottom:12 }}
          />
          <h1 style={{ fontSize:20, fontWeight:700, color:'#C9A84C', letterSpacing:2 }}>KRINAS TECH</h1>
          <p style={{ fontSize:11, color:'#8A8070', letterSpacing:2, textTransform:'uppercase', marginTop:3 }}>Gadgets Galore</p>
        </div>

        {/* FORM */}
        <label style={{ fontSize:11, color:'#8A8070', letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:5 }}>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
          style={{ width:'100%', padding:'10px 12px', background:'#1C1C1C', border:'1px solid #333', borderRadius:8, color:'#F5F0E8', fontSize:14, marginBottom:12, outline:'none' }} />

        <label style={{ fontSize:11, color:'#8A8070', letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:5 }}>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onLogin(username, password)}
          placeholder="Enter password"
          style={{ width:'100%', padding:'10px 12px', background:'#1C1C1C', border:'1px solid #333', borderRadius:8, color:'#F5F0E8', fontSize:14, marginBottom:16, outline:'none' }} />

        <button onClick={() => onLogin(username, password)}
          style={{ width:'100%', padding:11, background:'#C9A84C', color:'#0A0A0A', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', letterSpacing:1, textTransform:'uppercase' }}>
          Sign In
        </button>

        <p style={{ fontSize:11, color:'#8A8070', textAlign:'center', marginTop:12 }}>
          Krinas Tech — Business Portal
        </p>

      </div>
    </div>
  )
}