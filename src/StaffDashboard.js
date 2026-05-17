import { useState, useEffect } from 'react'

const fmt = n => '\u20A6' + Number(Math.round(n)).toLocaleString()
const gold = '#C9A84C'
const k2 = '#141414'
const k3 = '#1C1C1C'
const mu = '#8A8070'
const w = '#F5F0E8'

export default function StaffDashboard({ currentUser, products, sales, page, setPage, cart, setCart, onRecordSale, onLogout }) {
  const [receipt, setReceipt] = useState(null)
  // mobile removed
  const [discount, setDiscount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const today = new Date().toISOString().split('T')[0]
  const firstName = currentUser.split(' ')[0]
  const mySales = sales.filter(s => s.staff === firstName)

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const nav = [
    { id:'pos', icon:'\uD83D\uDED2', label:'Sell' },
    { id:'myhistory', icon:'\uD83E\uDDFE', label:'My Sales' },
    { id:'stockview', icon:'\uD83D\uDCE6', label:'Stock' },
  ]

  function addToCart(product) {
    if(product.qty===0) return
    const ex = cart.find(c => c.id === product.id)
    if(ex) {
      if(ex.qty >= product.qty) return
      setCart(cart.map(c => c.id === product.id ? {...c, qty: c.qty+1} : c))
    } else {
      setCart([...cart, {...product, qty:1}])
    }
  }

  function changeQty(id, delta) {
    const item = cart.find(c => c.id === id)
    const product = products.find(p => p.id === id)
    const nq = item.qty + delta
    if(nq < 1) { setCart(cart.filter(c => c.id !== id)); return }
    if(nq > product.qty) return
    setCart(cart.map(c => c.id === id ? {...c, qty: nq} : c))
  }

  async function handleConfirmSale() {
    const cartWithRemaining = cart.map(item => {
      const product = products.find(p => p.id === item.id)
      return {...item, qty_remaining: product.qty - item.qty}
    })
    const priceTag = cart.reduce((a,c) => a + c.sell*c.qty, 0)
    const discountAmount = parseFloat(discount) || 0
    const paidPrice = priceTag - discountAmount

    await onRecordSale(cartWithRemaining, {
      price_tag: priceTag,
      discount: discountAmount,
      paid_price: paidPrice,
      payment_method: paymentMethod
    })

    setReceipt({
      items: cart.map(c => ({name:c.name, qty:c.qty, price:c.sell*c.qty})),
      priceTag,
      discount: discountAmount,
      paidPrice,
      paymentMethod,
      date: today
    })
    setCart([])
    setDiscount('')
    setPaymentMethod('Cash')
  }

  const cartTotal = cart.reduce((a,c) => a + c.sell*c.qty, 0)
  const cartCount = cart.reduce((a,c) => a + c.qty, 0)
  const discountAmount = parseFloat(discount) || 0
  const paidPrice = cartTotal - discountAmount

  if(receipt) return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:k2, border:`1px solid ${gold}`, borderRadius:14, padding:24, width:'100%', maxWidth:340 }}>
        <div style={{ textAlign:'center', fontSize:44, marginBottom:8 }}>✅</div>
        <div style={{ fontSize:16, fontWeight:700, color:gold, textAlign:'center', marginBottom:4 }}>Sale Complete!</div>
        <div style={{ fontSize:12, color:mu, textAlign:'center', marginBottom:16 }}>{receipt.date} — {firstName}</div>
        {receipt.items.map((it,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'5px 0', borderBottom:'1px solid #1A1A1A', color:w }}>
            <span>{it.name}{it.qty>1?' x'+it.qty:''}</span>
            <span style={{ color:gold, fontWeight:600 }}>{fmt(it.price)}</span>
          </div>
        ))}
        <div style={{ marginTop:12, background:k3, borderRadius:8, padding:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:mu, marginBottom:6 }}>
            <span>Price Tag</span><span style={{ color:w }}>{fmt(receipt.priceTag)}</span>
          </div>
          {receipt.discount > 0 && (
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:mu, marginBottom:6 }}>
              <span>Discount</span><span style={{ color:'#E07070' }}>-{fmt(receipt.discount)}</span>
            </div>
          )}
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:15, fontWeight:700, color:gold, paddingTop:6, borderTop:'1px solid #333' }}>
            <span>Paid</span><span>{fmt(receipt.paidPrice)}</span>
          </div>
          <div style={{ fontSize:12, color:mu, textAlign:'center', marginTop:8 }}>
            Payment: <span style={{ color:w, fontWeight:600 }}>{receipt.paymentMethod}</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:16 }}>
          <button onClick={() => { setReceipt(null); setPage('pos') }} style={{ flex:1, padding:11, background:'transparent', border:'1px solid #333', borderRadius:10, color:mu, fontSize:13, cursor:'pointer' }}>New Sale</button>
          <button onClick={() => { setReceipt(null); setPage('myhistory') }} style={{ flex:1, padding:11, background:gold, color:'#0A0A0A', border:'none', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer' }}>History</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', flexDirection:'column' }}>

      {/* TOPBAR */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', height:52, background:k2, borderBottom:'1px solid #222', flexShrink:0, position:'sticky', top:0, zIndex:200 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src="/icon-512.png" alt="logo" onError={e=>e.target.style.display='none'} style={{ width:28, height:28, borderRadius:6, objectFit:'contain' }} />
          <span style={{ fontSize:14, fontWeight:700, color:gold, letterSpacing:1 }}>KRINAS TECH</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, padding:'3px 8px', borderRadius:20, background:'#0A1A0A', color:'#6DBF6D', border:'1px solid #2A5A2A', fontWeight:600 }}>Staff</span>
          <span style={{ fontSize:12, color:w }}>{firstName}</span>
          <button onClick={onLogout} style={{ fontSize:11, padding:'5px 10px', background:'transparent', border:'1px solid #333', borderRadius:6, color:mu, cursor:'pointer' }}>Logout</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:'12px 12px 80px', WebkitOverflowScrolling:'touch' }}>

        {/* POS PAGE */}
        {page === 'pos' && (
          <div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:16, fontWeight:700, color:gold }}>Welcome, {firstName}!</div>
              <div style={{ fontSize:12, color:mu, marginTop:2 }}>Tap a product to add to cart</div>
            </div>

            {cart.length > 0 && (
              <div style={{ background:k2, border:`1px solid ${gold}`, borderRadius:10, padding:'10px 14px', marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:mu }}>{cartCount} item(s) in cart</span>
                <span style={{ fontSize:16, fontWeight:700, color:gold }}>{fmt(cartTotal)}</span>
              </div>
            )}

            {/* Product grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:16 }}>
              {products.map(p => (
                <div key={p.id} onClick={() => addToCart(p)}
                  style={{ background:k2, border: cart.find(c=>c.id===p.id) ? `1.5px solid ${gold}` : '1px solid #2A2A2A', borderRadius:12, padding:14, cursor:p.qty===0?'not-allowed':'pointer', opacity:p.qty===0?0.4:1, position:'relative' }}>
                  {cart.find(c=>c.id===p.id) && (
                    <div style={{ position:'absolute', top:8, right:8, width:20, height:20, borderRadius:'50%', background:gold, color:'#0A0A0A', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {cart.find(c=>c.id===p.id).qty}
                    </div>
                  )}
                  {p.category && <div style={{ fontSize:10, color:mu, marginBottom:4, textTransform:'uppercase', letterSpacing:1 }}>{p.category}</div>}
                  <div style={{ fontSize:13, fontWeight:700, color:w, marginBottom:4, lineHeight:1.3 }}>{p.name}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:gold }}>{fmt(p.sell)}</div>
                  <div style={{ fontSize:11, marginTop:4, color:p.qty===0?'#E07070':p.qty<=3?'#D4A040':'#6DBF6D' }}>
                    {p.qty===0?'Out of stock':p.qty<=3?p.qty+' left':p.qty+' in stock'}
                  </div>
                </div>
              ))}
            </div>

            {/* Cart */}
            {cart.length > 0 && (
              <div style={{ background:k2, border:'1px solid #222', borderRadius:12, overflow:'hidden', marginBottom:12 }}>
                <div style={{ padding:'12px 14px', borderBottom:'1px solid #222', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:13, fontWeight:700, color:gold }}>Cart</span>
                  <span style={{ fontSize:12, color:mu }}>{cartCount} items</span>
                </div>
                <div style={{ padding:'8px 14px' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom:'1px solid #1A1A1A' }}>
                      <div style={{ flex:1, fontSize:12, color:w }}>
                        {item.name}
                        <br/><span style={{ fontSize:11, color:mu }}>{fmt(item.sell)} each</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <button onClick={() => changeQty(item.id,-1)} style={{ width:28, height:28, background:k3, border:'1px solid #333', borderRadius:8, color:w, fontSize:16, cursor:'pointer' }}>-</button>
                        <span style={{ fontSize:14, fontWeight:700, color:w, minWidth:20, textAlign:'center' }}>{item.qty}</span>
                        <button onClick={() => changeQty(item.id,1)} style={{ width:28, height:28, background:k3, border:'1px solid #333', borderRadius:8, color:w, fontSize:16, cursor:'pointer' }}>+</button>
                      </div>
                      <div style={{ fontSize:13, color:gold, fontWeight:600 }}>{fmt(item.sell*item.qty)}</div>
                      <span onClick={() => setCart(cart.filter(c=>c.id!==item.id))} style={{ color:'#E07070', cursor:'pointer', fontSize:18 }}>x</span>
                    </div>
                  ))}
                </div>

                {/* Discount + Payment */}
                <div style={{ padding:'12px 14px', borderTop:'1px solid #222', background:k3 }}>
                  <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, color:mu, marginBottom:4, textTransform:'uppercase', letterSpacing:1 }}>Discount (\u20A6)</div>
                      <input type="number" placeholder="0" value={discount} onChange={e=>setDiscount(e.target.value)}
                        style={{ width:'100%', padding:'8px 10px', background:k2, border:'1px solid #333', borderRadius:8, color:w, fontSize:13, outline:'none' }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, color:mu, marginBottom:4, textTransform:'uppercase', letterSpacing:1 }}>Payment</div>
                      <select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}
                        style={{ width:'100%', padding:'8px 10px', background:k2, border:'1px solid #333', borderRadius:8, color:w, fontSize:13, outline:'none' }}>
                        <option value="Cash">Cash</option>
                        <option value="Transfer">Transfer</option>
                        <option value="POS">POS</option>
                      </select>
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ background:k2, borderRadius:8, padding:10, marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:mu, marginBottom:4 }}>
                      <span>Price Tag</span><span style={{ color:w }}>{fmt(cartTotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:mu, marginBottom:4 }}>
                        <span>Discount</span><span style={{ color:'#E07070' }}>-{fmt(discountAmount)}</span>
                      </div>
                    )}
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:15, fontWeight:700, color:gold, paddingTop:6, borderTop:'1px solid #333' }}>
                      <span>Total to Pay</span><span>{fmt(paidPrice)}</span>
                    </div>
                  </div>

                  <button onClick={handleConfirmSale} style={{ width:'100%', padding:14, background:gold, color:'#0A0A0A', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer' }}>
                    Confirm Sale — {fmt(paidPrice)}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MY HISTORY */}
        {page === 'myhistory' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:16 }}>
              {[['My Sales', mySales.length, 'Total', gold],
                ['Revenue', fmt(mySales.reduce((a,s)=>a+s.total,0)), 'All time', w],
                ['Today', mySales.filter(s=>s.date===today).length, 'Sales', w],
                ['Discounts', fmt(mySales.reduce((a,s)=>a+(s.discount||0),0)), 'Given', '#E07070']
              ].map(([label,val,sub,color])=>(
                <div key={label} style={{ background:k2, border:'1px solid #333', borderRadius:12, padding:14 }}>
                  <div style={{ fontSize:11, color:mu, letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>{label}</div>
                  <div style={{ fontSize:20, fontWeight:700, color }}>{val}</div>
                  <div style={{ fontSize:11, color:mu, marginTop:3 }}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>My sales history</div>
            <div style={{ background:k2, border:'1px solid #333', borderRadius:12, overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:400 }}>
                <thead><tr style={{ background:k3 }}>
                  {['Items','Price Tag','Discount','Paid','Payment','Date'].map(h=><th key={h} style={{ textAlign:'left', padding:'12px 14px', fontSize:12, color:gold, borderBottom:'1px solid #333', whiteSpace:'nowrap', fontWeight:700 }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {mySales.length===0
                    ?<tr><td colSpan={6} style={{ textAlign:'center', padding:'2rem', color:mu }}>No sales yet</td></tr>
                    :mySales.slice().reverse().map(s=>{
                      const items=s.items.map(i=>i.name+(i.qty>1?' x'+i.qty:'')).join(', ')
                      return(
                        <tr key={s.id} style={{ borderBottom:'1px solid #222' }}>
                          <td style={{ padding:'12px 14px', color:w, whiteSpace:'nowrap', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', fontWeight:600 }} title={items}>{items}</td>
                          <td style={{ padding:'12px 14px', color:w, fontWeight:600, whiteSpace:'nowrap' }}>{fmt(s.price_tag||s.total)}</td>
                          <td style={{ padding:'12px 14px', color:'#E07070', fontWeight:600, whiteSpace:'nowrap' }}>{fmt(s.discount||0)}</td>
                          <td style={{ padding:'12px 14px', color:gold, fontWeight:700, whiteSpace:'nowrap' }}>{fmt(s.paid_price||s.total)}</td>
                          <td style={{ padding:'12px 14px', whiteSpace:'nowrap' }}>
                            <span style={{ background: s.payment_method==='Cash'?'#0A2A0A':s.payment_method==='Transfer'?'#0A1A2A':'#1A1A0A', color: s.payment_method==='Cash'?'#6DBF6D':s.payment_method==='Transfer'?'#6DB3DF':'#D4A040', padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:700 }}>
                              {s.payment_method||'Cash'}
                            </span>
                          </td>
                          <td style={{ padding:'12px 14px', color:mu, whiteSpace:'nowrap' }}>{s.date}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STOCK VIEW */}
        {page === 'stockview' && (
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Available stock</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
              {products.map(p => (
                <div key={p.id} style={{ background:k2, border:'1px solid #2A2A2A', borderRadius:12, padding:14, opacity:p.qty===0?0.4:1 }}>
                  {p.category && <div style={{ fontSize:10, color:mu, marginBottom:4, textTransform:'uppercase', letterSpacing:1 }}>{p.category}</div>}
                  <div style={{ fontSize:13, fontWeight:700, color:w, marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:gold }}>{fmt(p.sell)}</div>
                  <div style={{ fontSize:11, marginTop:4, color:p.qty===0?'#E07070':p.qty<=3?'#D4A040':'#6DBF6D' }}>
                    {p.qty===0?'Out of stock':p.qty<=3?p.qty+' left':p.qty+' in stock'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, background:k2, borderTop:'1px solid #2A2A2A', display:'flex', zIndex:100 }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            style={{ flex:1, padding:'8px 4px 10px', background:'transparent', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, position:'relative' }}>
            <span style={{ fontSize:22 }}>{n.icon}</span>
            {n.id==='pos' && cart.length>0 && (
              <div style={{ position:'absolute', top:4, right:'25%', width:16, height:16, borderRadius:'50%', background:'#E07070', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{cartCount}</div>
            )}
            <span style={{ fontSize:10, color:page===n.id?gold:mu, fontWeight:page===n.id?700:400 }}>{n.label}</span>
            {page===n.id && <div style={{ width:4, height:4, borderRadius:'50%', background:gold }}></div>}
          </button>
        ))}
      </div>

    </div>
  )
}