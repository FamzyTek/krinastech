import { useState } from 'react'

const fmt = n => '₦' + Number(Math.round(n)).toLocaleString()
const gold = '#C9A84C'
const k2 = '#141414'
const k3 = '#1C1C1C'
const mu = '#8A8070'
const w = '#F5F0E8'

export default function StaffDashboard({ currentUser, products, sales, page, setPage, cart, setCart, onRecordSale, onLogout }) {
  const [receipt, setReceipt] = useState(null)
  const today = new Date().toISOString().split('T')[0]
  const firstName = currentUser.split(' ')[0]
  const mySales = sales.filter(s => s.staff === firstName)
  const isMobile = window.innerWidth < 768

  const nav = [
    { id:'pos', label:'Sell' },
    { id:'myhistory', label:'My Sales' },
    { id:'stockview', label:'Stock' },
  ]

  function addToCart(product) {
    if (product.qty === 0) return
    const existing = cart.find(c => c.id === product.id)
    if (existing) {
      if (existing.qty >= product.qty) return
      setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  function changeQty(id, delta) {
    const item = cart.find(c => c.id === id)
    const product = products.find(p => p.id === id)
    const newQty = item.qty + delta
    if (newQty < 1) { setCart(cart.filter(c => c.id !== id)); return }
    if (newQty > product.qty) return
    setCart(cart.map(c => c.id === id ? { ...c, qty: newQty } : c))
  }

  async function handleConfirmSale() {
    const cartWithRemaining = cart.map(item => {
      const product = products.find(p => p.id === item.id)
      return { ...item, qty_remaining: product.qty - item.qty }
    })
    await onRecordSale(cartWithRemaining)
    const total = cart.reduce((a, c) => a + c.sell * c.qty, 0)
    setReceipt({ items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.sell * c.qty })), total, staff: currentUser, date: today })
    setCart([])
  }

  const cartTotal = cart.reduce((a, c) => a + c.sell * c.qty, 0)

  if (receipt) return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:k2, border:'1px solid #C9A84C', borderRadius:12, padding:22, width:'100%', maxWidth:320 }}>
        <div style={{ textAlign:'center', marginBottom:8, fontSize:32 }}>✅</div>
        <div style={{ fontSize:14, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', textAlign:'center', marginBottom:4 }}>Sale Complete</div>
        <div style={{ fontSize:11, color:mu, textAlign:'center', marginBottom:14 }}>{receipt.date} | {receipt.staff}</div>
        {receipt.items.map((it, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:12, padding:'4px 0', borderBottom:'1px solid #1A1A1A', color:'#EDE8DC' }}>
            <span>{it.name}{it.qty > 1 ? ' x' + it.qty : ''}</span><span>{fmt(it.price)}</span>
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, fontWeight:700, color:gold, padding:'10px 0 0' }}>
          <span>Total</span><span>{fmt(receipt.total)}</span>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:14 }}>
          <button onClick={() => { setReceipt(null); setPage('pos') }} style={{ flex:1, padding:9, background:'transparent', border:'1px solid #333', borderRadius:8, color:mu, fontSize:12, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>New Sale</button>
          <button onClick={() => { setReceipt(null); setPage('myhistory') }} style={{ flex:1, padding:9, background:gold, color:'#0A0A0A', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>View History</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 18px', height:50, background:k2, borderBottom:'1px solid #222' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:18, color:gold }}>⚡</span>
          <span style={{ fontSize:15, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase' }}>Krinas Tech</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'#0A1A0A', color:'#6DBF6D', border:'1px solid #2A5A2A', letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>Staff</span>
          <span style={{ fontSize:12, color:mu }}>{currentUser}</span>
          <button onClick={onLogout} style={{ fontSize:11, padding:'5px 10px', background:'transparent', border:'1px solid #333', borderRadius:6, color:mu, cursor:'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ display:'flex', gap:2, padding:'0 18px', background:k3, borderBottom:'1px solid #222', overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            style={{ padding:'11px 16px', fontSize:11, border:'none', background:'transparent', cursor:'pointer', color: page === n.id ? gold : mu, letterSpacing:1, textTransform:'uppercase', borderBottom: page === n.id ? '2px solid #C9A84C' : '2px solid transparent', whiteSpace:'nowrap' }}>
            {n.label}
          </button>
        ))}
      </div>

      <div style={{ padding:16, flex:1 }}>

        {page === 'pos' && (
          <div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:16, fontWeight:700, color:gold }}>Welcome, {firstName}</div>
              <div style={{ fontSize:12, color:mu, marginTop:2 }}>Tap a product to add to cart</div>
            </div>

            {isMobile ? (
              <div>
                <input placeholder="Search product..." style={{ width:'100%', padding:'10px 14px', background:k2, border:'1px solid #333', borderRadius:10, color:w, fontSize:14, outline:'none', marginBottom:12 }} />
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10, marginBottom:16 }}>
                  {products.map(p => (
                    <div key={p.id} onClick={() => addToCart(p)}
                      style={{ background:k2, border:'1px solid #2A2A2A', borderRadius:10, padding:14, cursor: p.qty === 0 ? 'not-allowed' : 'pointer', opacity: p.qty === 0 ? 0.45 : 1 }}>
                      <div style={{ width:44, height:44, background:k3, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, fontSize:22, color:gold }}>📱</div>
                      <div style={{ fontSize:13, fontWeight:600, color:w, marginBottom:4, lineHeight:1.3 }}>{p.name}</div>
                      <div style={{ fontSize:14, fontWeight:700, color:gold }}>{fmt(p.sell)}</div>
                      <div style={{ fontSize:11, marginTop:4 }}>
                        {p.qty === 0 ? <span style={{ color:'#E07070' }}>Out</span>
                          : p.qty <= 3 ? <span style={{ color:'#D4A040' }}>{p.qty} left</span>
                          : <span style={{ color:'#6DBF6D' }}>{p.qty} in stock</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background:k2, border:'1px solid #222', borderRadius:10, overflow:'hidden' }}>
                  <div style={{ padding:'12px 14px', borderBottom:'1px solid #222' }}>
                    <div style={{ fontSize:13, fontWeight:600, color:gold, letterSpacing:2, textTransform:'uppercase' }}>🛒 Current Sale</div>
                  </div>
                  <div style={{ padding:'10px 14px' }}>
                    {cart.length === 0
                      ? <div style={{ textAlign:'center', padding:'1rem', color:mu, fontSize:13 }}>Tap products above to add</div>
                      : cart.map((item) => (
                        <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom:'1px solid #1A1A1A' }}>
                          <div style={{ flex:1, fontSize:12, color:'#EDE8DC' }}>{item.name}<br /><span style={{ fontSize:11, color:mu }}>{fmt(item.sell)} each</span></div>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <button onClick={() => changeQty(item.id, -1)} style={{ width:24, height:24, background:k3, border:'1px solid #333', borderRadius:6, color:w, fontSize:14, cursor:'pointer' }}>−</button>
                            <span style={{ fontSize:13, fontWeight:600, color:w, minWidth:16, textAlign:'center' }}>{item.qty}</span>
                            <button onClick={() => changeQty(item.id, 1)} style={{ width:24, height:24, background:k3, border:'1px solid #333', borderRadius:6, color:w, fontSize:14, cursor:'pointer' }}>+</button>
                          </div>
                          <div style={{ fontSize:12, color:gold, fontWeight:600 }}>{fmt(item.sell * item.qty)}</div>
                          <span onClick={() => setCart(cart.filter(c => c.id !== item.id))} style={{ color:'#E07070', cursor:'pointer', fontSize:16 }}>✕</span>
                        </div>
                      ))
                    }
                  </div>
                  <div style={{ padding:14, borderTop:'1px solid #222' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                      <span style={{ fontSize:12, color:mu, textTransform:'uppercase', letterSpacing:1 }}>Total</span>
                      <span style={{ fontSize:20, fontWeight:700, color:gold }}>{fmt(cartTotal)}</span>
                    </div>
                    <button onClick={handleConfirmSale} disabled={cart.length === 0}
                      style={{ width:'100%', padding:12, background: cart.length === 0 ? '#333' : gold, color: cart.length === 0 ? mu : '#0A0A0A', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor: cart.length === 0 ? 'not-allowed' : 'pointer', letterSpacing:1, textTransform:'uppercase' }}>
                      Confirm Sale
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:14, minHeight:480 }}>
                <div>
                  <input placeholder="Search product..." style={{ width:'100%', padding:'10px 14px', background:k2, border:'1px solid #333', borderRadius:10, color:w, fontSize:14, outline:'none', marginBottom:12 }} />
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10 }}>
                    {products.map(p => (
                      <div key={p.id} onClick={() => addToCart(p)}
                        style={{ background:k2, border:'1px solid #2A2A2A', borderRadius:10, padding:14, cursor: p.qty === 0 ? 'not-allowed' : 'pointer', opacity: p.qty === 0 ? 0.45 : 1 }}>
                        <div style={{ width:44, height:44, background:k3, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, fontSize:22, color:gold }}>📱</div>
                        <div style={{ fontSize:13, fontWeight:600, color:w, marginBottom:4, lineHeight:1.3 }}>{p.name}</div>
                        <div style={{ fontSize:14, fontWeight:700, color:gold }}>{fmt(p.sell)}</div>
                        <div style={{ fontSize:11, marginTop:4 }}>
                          {p.qty === 0 ? <span style={{ color:'#E07070' }}>Out of stock</span>
                            : p.qty <= 3 ? <span style={{ color:'#D4A040' }}>{p.qty} left</span>
                            : <span style={{ color:'#6DBF6D' }}>{p.qty} in stock</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', background:k2, border:'1px solid #222', borderRadius:10, overflow:'hidden' }}>
                  <div style={{ padding:'14px 14px 10px', borderBottom:'1px solid #222' }}>
                    <div style={{ fontSize:13, fontWeight:600, color:gold, letterSpacing:2, textTransform:'uppercase' }}>🛒 Current Sale</div>
                  </div>
                  <div style={{ flex:1, padding:'10px 14px', minHeight:200 }}>
                    {cart.length === 0
                      ? <div style={{ textAlign:'center', padding:'2rem', color:mu, fontSize:13 }}>Tap products to add</div>
                      : cart.map((item) => (
                        <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom:'1px solid #1A1A1A' }}>
                          <div style={{ flex:1, fontSize:12, color:'#EDE8DC', lineHeight:1.3 }}>
                            {item.name}<br /><span style={{ fontSize:11, color:mu }}>{fmt(item.sell)} each</span>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <button onClick={() => changeQty(item.id, -1)} style={{ width:24, height:24, background:k3, border:'1px solid #333', borderRadius:6, color:w, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                            <span style={{ fontSize:13, fontWeight:600, color:w, minWidth:16, textAlign:'center' }}>{item.qty}</span>
                            <button onClick={() => changeQty(item.id, 1)} style={{ width:24, height:24, background:k3, border:'1px solid #333', borderRadius:6, color:w, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                          </div>
                          <div style={{ fontSize:12, color:gold, fontWeight:600, minWidth:70, textAlign:'right' }}>{fmt(item.sell * item.qty)}</div>
                          <span onClick={() => setCart(cart.filter(c => c.id !== item.id))} style={{ color:'#E07070', cursor:'pointer', fontSize:16, marginLeft:4 }}>✕</span>
                        </div>
                      ))
                    }
                  </div>
                  <div style={{ borderTop:'1px solid #222', padding:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <span style={{ fontSize:12, color:mu, letterSpacing:1, textTransform:'uppercase' }}>Total</span>
                      <span style={{ fontSize:20, fontWeight:700, color:gold }}>{fmt(cartTotal)}</span>
                    </div>
                    <button onClick={handleConfirmSale} disabled={cart.length === 0}
                      style={{ width:'100%', padding:12, background: cart.length === 0 ? '#333' : gold, color: cart.length === 0 ? mu : '#0A0A0A', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor: cart.length === 0 ? 'not-allowed' : 'pointer', letterSpacing:1, textTransform:'uppercase' }}>
                      Confirm Sale
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {page === 'myhistory' && (
          <div>
            <div style={{ display:'flex', overflowX:'auto', WebkitOverflowScrolling:'touch', gap:10, marginBottom:16, paddingBottom:4 }}>
              {[['My Transactions', mySales.length, 'Total', gold],
                ['Revenue Generated', fmt(mySales.reduce((a,s)=>a+s.total,0)), 'All time', w],
                ['Today Sales', mySales.filter(s=>s.date===today).length, 'Transactions', w]].map(([label, val, sub, color]) => (
                <div key={label} style={{ background:k2, border:'1px solid #222', borderRadius:10, padding:14, minWidth:140, flexShrink:0 }}>
                  <div style={{ fontSize:11, color:mu, letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>{label}</div>
                  <div style={{ fontSize:22, fontWeight:700, color }}>{val}</div>
                  <div style={{ fontSize:11, color:mu, marginTop:3 }}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:12, fontWeight:600, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>My sales history</div>
            <div style={{ background:k2, border:'1px solid #222', borderRadius:10, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:400 }}>
                <thead><tr style={{ background:k3 }}>
                  {['Items','Total','Qty','Date'].map(h => (
                    <th key={h} style={{ textAlign:'left', padding:'9px 12px', fontSize:11, color:mu, borderBottom:'1px solid #222', letterSpacing:1, textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mySales.length === 0
                    ? <tr><td colSpan={4} style={{ textAlign:'center', padding:'2rem', color:mu, fontSize:13 }}>No sales yet</td></tr>
                    : mySales.map(s => {
                      const items = s.items.map(i => i.name + (i.qty > 1 ? ' x' + i.qty : '')).join(', ')
                      const qty = s.items.reduce((a, i) => a + i.qty, 0)
                      return (
                        <tr key={s.id} style={{ borderBottom:'1px solid #1A1A1A' }}>
                          <td style={{ padding:'9px 12px', color:w, whiteSpace:'nowrap', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis' }} title={items}>{items}</td>
                          <td style={{ padding:'9px 12px', color:w, whiteSpace:'nowrap' }}>{fmt(s.total)}</td>
                          <td style={{ padding:'9px 12px', color:w, whiteSpace:'nowrap' }}>{qty}</td>
                          <td style={{ padding:'9px 12px', color:w, whiteSpace:'nowrap' }}>{s.date}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {page === 'stockview' && (
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Available stock</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10 }}>
              {products.map(p => (
                <div key={p.id} style={{ background:k2, border:'1px solid #2A2A2A', borderRadius:10, padding:14, opacity: p.qty === 0 ? 0.45 : 1 }}>
                  <div style={{ width:44, height:44, background:k3, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, fontSize:22, color:gold }}>📱</div>
                  <div style={{ fontSize:13, fontWeight:600, color:w, marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:gold }}>{fmt(p.sell)}</div>
                  <div style={{ fontSize:11, marginTop:4 }}>
                    {p.qty === 0 ? <span style={{ color:'#E07070' }}>Out of stock</span>
                      : p.qty <= 3 ? <span style={{ color:'#D4A040' }}>{p.qty} left</span>
                      : <span style={{ color:'#6DBF6D' }}>{p.qty} in stock</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}