import { useState, useEffect } from 'react'

const fmt = n => '\u20A6' + Number(Math.round(n)).toLocaleString()
const gold = '#C9A84C'
const k2 = '#141414'
const k3 = '#1C1C1C'
const mu = '#8A8070'
const w = '#F5F0E8'

export default function ManagementDashboard({ currentUser, products, sales, staffList, page, setPage, onDeleteSale, onUpdateSale, onAddProduct, onUpdateProduct, onDeleteProduct, onAddStaff, onRemoveStaff, onLogout }) {
  const [mobile, setMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const nav = [
    { id:'overview', icon:'\uD83C\uDFE0', label:'Home' },
    { id:'stock', icon:'\uD83D\uDCE6', label:'Stock' },
    { id:'sales', icon:'\uD83E\uDDFE', label:'Sales' },
    { id:'staff', icon:'\uD83D\uDC65', label:'Staff' },
  ]

  const today = new Date().toISOString().split('T')[0]
  const todaySales = sales.filter(s => s.date === today)
  const todayRev = todaySales.reduce((a, s) => a + s.total, 0)
  const totalRev = sales.reduce((a, s) => a + s.total, 0)
  const totalStock = products.reduce((a, p) => a + p.cost * p.qty, 0)
  const lowCount = products.filter(p => p.qty <= 3).length

  function resetPage(id) { setPage(id) }

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', flexDirection:'column' }}>

      {/* TOPBAR */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 18px', height:52, background:k2, borderBottom:'1px solid #222', flexShrink:0, position:'sticky', top:0, zIndex:200 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src="/icon-512.png" alt="logo" onError={e=>e.target.style.display='none'} style={{ width:28, height:28, borderRadius:6, objectFit:'contain' }} />
          <span style={{ fontSize:15, fontWeight:700, color:gold, letterSpacing:1 }}>KRINAS TECH</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'#1A0A2A', color:'#A07CC5', border:'1px solid #6A4A9A', fontWeight:600 }}>Management</span>
          {!mobile && <span style={{ fontSize:13, color:w }}>{currentUser}</span>}
          <button onClick={onLogout} style={{ fontSize:12, padding:'6px 12px', background:'transparent', border:'1px solid #333', borderRadius:6, color:w, cursor:'pointer' }}>Logout</button>
        </div>
      </div>

      {/* DESKTOP NAV */}
      {!mobile && (
        <div style={{ display:'flex', gap:2, padding:'0 18px', background:k3, borderBottom:'1px solid #222', flexShrink:0, position:'sticky', top:52, zIndex:100 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => resetPage(n.id)}
              style={{ padding:'12px 20px', fontSize:13, border:'none', background:'transparent', cursor:'pointer', color: page === n.id ? gold : w, fontWeight: page === n.id ? 700 : 400, borderBottom: page === n.id ? '2px solid #C9A84C' : '2px solid transparent', whiteSpace:'nowrap' }}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding: mobile ? '12px 12px 80px' : '20px', WebkitOverflowScrolling:'touch' }}>

        {/* OVERVIEW */}
        {page === 'overview' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns: mobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap:12, marginBottom:20 }}>
              {[['Stock Value', fmt(totalStock), products.length+' products', gold],
                ['Revenue', fmt(totalRev), 'All time', w],
                ['Today', fmt(todayRev), todaySales.length+' sales', w],
                ['Low/Out', lowCount, 'Need restock', '#E07070']].map(([label,val,sub,color])=>(
                <div key={label} style={{ background:k2, border:'1px solid #333', borderRadius:12, padding:16 }}>
                  <div style={{ fontSize:12, color:mu, letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>{label}</div>
                  <div style={{ fontSize:24, fontWeight:700, color }}>{val}</div>
                  <div style={{ fontSize:12, color:mu, marginTop:4 }}>{sub}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Recent transactions</div>
            <div style={{ background:k2, border:'1px solid #333', borderRadius:12, overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14, minWidth:500 }}>
                <thead><tr style={{ background:k3 }}>
                  {['Items','Staff','Total','Payment','Date'].map(h=><th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:12, color:gold, borderBottom:'1px solid #333', whiteSpace:'nowrap', fontWeight:700 }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {sales.length === 0
                    ? <tr><td colSpan={5} style={{ padding:'2rem', textAlign:'center', color:mu }}>No sales yet</td></tr>
                    : sales.slice(0,6).map(s=>{
                      const items=s.items.map(i=>i.name+(i.qty>1?' x'+i.qty:'')).join(', ')
                      return(
                        <tr key={s.id} style={{ borderBottom:'1px solid #222' }}>
                          <td style={{ padding:'12px 16px', color:w, fontWeight:600, whiteSpace:'nowrap', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis' }} title={items}>{items}</td>
                          <td style={{ padding:'12px 16px', color:w, fontWeight:600, whiteSpace:'nowrap' }}>{s.staff}</td>
                          <td style={{ padding:'12px 16px', color:w, fontWeight:600, whiteSpace:'nowrap' }}>{fmt(s.paid_price || s.total)}</td>
                          <td style={{ padding:'12px 16px', color:gold, fontWeight:600, whiteSpace:'nowrap' }}>{s.payment_method || 'Cash'}</td>
                          <td style={{ padding:'12px 16px', color:w, fontWeight:600, whiteSpace:'nowrap' }}>{s.date}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>

            <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', margin:'20px 0 12px' }}>Stock alerts</div>
            {products.filter(p=>p.qty<=3).length===0
              ?<div style={{ background:'#0A2A0A', border:'1px solid #1A4A1A', color:'#6DBF6D', padding:'12px 16px', borderRadius:10, fontSize:14, fontWeight:600 }}>All products well stocked</div>
              :products.filter(p=>p.qty<=3).map(p=>(
                <div key={p.id} style={{ background:p.qty===0?'#2A0A0A':'#2A1A00', border:`1px solid ${p.qty===0?'#4A1A1A':'#4A3000'}`, color:p.qty===0?'#E07070':'#D4A040', padding:'12px 16px', borderRadius:10, fontSize:14, fontWeight:600, marginBottom:8 }}>
                  {p.name} -- {p.qty} unit(s) left
                </div>
              ))
            }
          </div>
        )}

        {/* STOCK */}
        {page === 'stock' && (
          <StockPage products={products} onAdd={onAddProduct} onUpdate={onUpdateProduct} onDelete={onDeleteProduct} />
        )}

        {/* SALES */}
        {page === 'sales' && (
          <SalesPage sales={sales} onDelete={onDeleteSale} onUpdate={onUpdateSale} />
        )}

        {/* STAFF */}
        {page === 'staff' && (
          <StaffPage staffList={staffList} onAdd={onAddStaff} onRemove={onRemoveStaff} />
        )}

      </div>

      {/* MOBILE BOTTOM NAV */}
      {mobile && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:k2, borderTop:'1px solid #2A2A2A', display:'flex', zIndex:100 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => resetPage(n.id)}
              style={{ flex:1, padding:'8px 4px 10px', background:'transparent', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <span style={{ fontSize:22 }}>{n.icon}</span>
              <span style={{ fontSize:10, color: page === n.id ? gold : mu, fontWeight: page === n.id ? 700 : 400 }}>{n.label}</span>
              {page === n.id && <div style={{ width:4, height:4, borderRadius:'50%', background:gold }}></div>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StockPage({ products, onAdd, onUpdate, onDelete }) {
  const [name, setName] = useState('')
  const [cat, setCat] = useState('')
  const [cost, setCost] = useState('')
  const [sell, setSell] = useState('')
  const [qty, setQty] = useState('')
  const gold = '#C9A84C'
  const k2 = '#141414'
  const k3 = '#1C1C1C'
  const mu = '#8A8070'
  const w = '#F5F0E8'
  const fmt = n => '\u20A6' + Number(Math.round(n)).toLocaleString()

  function handleAdd() {
    if (!name || !cat || !cost || !sell || !qty) return alert('Fill all fields')
    onAdd({ name, category: cat, cost: parseFloat(cost), sell: parseFloat(sell), qty: parseInt(qty) })
    setName(''); setCat(''); setCost(''); setSell(''); setQty('')
  }

  return (
    <div>
      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Add product</div>
      <div style={{ background:k2, border:'1px solid #333', borderRadius:12, padding:16, marginBottom:16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10, marginBottom:12 }}>
          {[['Product name',name,setName,'text'],['Category',cat,setCat,'text'],['Cost price',cost,setCost,'number'],['Selling price',sell,setSell,'number'],['Quantity',qty,setQty,'number']].map(([ph,val,setter,type])=>(
            <input key={ph} type={type} placeholder={ph} value={val} onChange={e=>setter(e.target.value)}
              style={{ width:'100%', padding:'10px 12px', background:k3, border:'1px solid #444', borderRadius:8, color:w, fontSize:14, outline:'none' }} />
          ))}
        </div>
        <button onClick={handleAdd} style={{ padding:'10px 24px', background:gold, color:'#0A0A0A', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Add Product</button>
      </div>

      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>All inventory</div>
      <div style={{ background:k2, border:'1px solid #333', borderRadius:12, overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14, minWidth:600 }}>
          <thead><tr style={{ background:k3 }}>
            {['Product','Category','Cost','Sell Price','Qty','Status','Actions'].map(h=><th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:12, color:gold, borderBottom:'1px solid #333', whiteSpace:'nowrap', fontWeight:700 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {products.map(p=>(
              <tr key={p.id} style={{ borderBottom:'1px solid #222' }}>
                <td style={{ padding:'12px 16px', color:w, fontWeight:700, whiteSpace:'nowrap' }}>{p.name}</td>
                <td style={{ padding:'12px 16px', color:w, fontWeight:600, whiteSpace:'nowrap' }}>{p.category || 'General'}</td>
                <td style={{ padding:'12px 16px', color:w, fontWeight:600, whiteSpace:'nowrap' }}>{fmt(p.cost)}</td>
                <td style={{ padding:'12px 16px', color:gold, fontWeight:700, whiteSpace:'nowrap' }}>{fmt(p.sell)}</td>
                <td style={{ padding:'12px 16px', color:w, fontWeight:700, whiteSpace:'nowrap' }}>{p.qty}</td>
                <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                  {p.qty===0?<span style={{ background:'#2A0A0A', color:'#E07070', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>Out</span>
                    :p.qty<=3?<span style={{ background:'#2A1A00', color:'#D4A040', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>Low</span>
                    :<span style={{ background:'#0A2A0A', color:'#6DBF6D', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>Good</span>}
                </td>
                <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                  <button onClick={()=>{const a=prompt('Add units?');if(a&&parseInt(a)>0)onUpdate(p.id,{qty:p.qty+parseInt(a)})}} style={{ marginRight:6, padding:'6px 12px', background:'transparent', border:'1px solid #444', borderRadius:6, color:w, fontSize:12, cursor:'pointer', fontWeight:600 }}>+Stock</button>
                  <button onClick={()=>{if(window.confirm('Delete?'))onDelete(p.id)}} style={{ padding:'6px 12px', background:'transparent', border:'1px solid #4A1A1A', borderRadius:6, color:'#E07070', fontSize:12, cursor:'pointer', fontWeight:600 }}>Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SalesPage({ sales, onDelete, onUpdate }) {
  const gold = '#C9A84C'
  const k2 = '#141414'
  const k3 = '#1C1C1C'
  const mu = '#8A8070'
  const w = '#F5F0E8'
  const fmt = n => '\u20A6' + Number(Math.round(n)).toLocaleString()

  return (
    <div>
      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>All transactions</div>
      <div style={{ background:k2, border:'1px solid #333', borderRadius:12, overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14, minWidth:700 }}>
          <thead><tr style={{ background:k3 }}>
            {['Items','Staff','Price Tag','Discount','Paid Price','Payment','Date'].map(h=><th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:12, color:gold, borderBottom:'1px solid #333', whiteSpace:'nowrap', fontWeight:700 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {sales.length === 0
              ? <tr><td colSpan={7} style={{ padding:'2rem', textAlign:'center', color:mu }}>No sales yet</td></tr>
              : sales.map(s=>{
                const items=s.items.map(i=>i.name+(i.qty>1?' x'+i.qty:'')).join(', ')
                return(
                  <tr key={s.id} style={{ borderBottom:'1px solid #222' }}>
                    <td style={{ padding:'12px 16px', color:w, fontWeight:600, whiteSpace:'nowrap', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis' }} title={items}>{items}</td>
                    <td style={{ padding:'12px 16px', color:w, fontWeight:600, whiteSpace:'nowrap' }}>{s.staff}</td>
                    <td style={{ padding:'12px 16px', color:w, fontWeight:600, whiteSpace:'nowrap' }}>{fmt(s.price_tag || s.total)}</td>
                    <td style={{ padding:'12px 16px', color:'#E07070', fontWeight:600, whiteSpace:'nowrap' }}>{fmt(s.discount || 0)}</td>
                    <td style={{ padding:'12px 16px', color:gold, fontWeight:700, whiteSpace:'nowrap' }}>{fmt(s.paid_price || s.total)}</td>
                    <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                      <span style={{ background: s.payment_method === 'Cash' ? '#0A2A0A' : s.payment_method === 'Transfer' ? '#0A1A2A' : '#1A1A0A', color: s.payment_method === 'Cash' ? '#6DBF6D' : s.payment_method === 'Transfer' ? '#6DB3DF' : '#D4A040', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>
                        {s.payment_method || 'Cash'}
                      </span>
                    </td>
                    <td style={{ padding:'12px 16px', color:w, fontWeight:600, whiteSpace:'nowrap' }}>{s.date}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StaffPage({ staffList, onAdd, onRemove }) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const gold = '#C9A84C'
  const k2 = '#141414'
  const k3 = '#1C1C1C'
  const mu = '#8A8070'
  const w = '#F5F0E8'

  function initials(n) { const p=n.split(' '); return(p[0][0]+(p[1]?p[1][0]:'')).toUpperCase() }

  return (
    <div>
      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Add account</div>
      <div style={{ background:k2, border:'1px solid #333', borderRadius:12, padding:16, marginBottom:16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10, marginBottom:12 }}>
          {[['Full name',name,setName,'text'],['Username',username,setUsername,'text'],['Password',password,setPassword,'password']].map(([ph,val,setter,type])=>(
            <input key={ph} type={type} placeholder={ph} value={val} onChange={e=>setter(e.target.value)}
              style={{ width:'100%', padding:'10px 12px', background:k3, border:'1px solid #444', borderRadius:8, color:w, fontSize:14, outline:'none' }} />
          ))}
          <select value={role} onChange={e=>setRole(e.target.value)}
            style={{ width:'100%', padding:'10px 12px', background:k3, border:'1px solid #444', borderRadius:8, color:w, fontSize:14, outline:'none' }}>
            <option value="staff">Staff</option>
            <option value="management">Management</option>
          </select>
        </div>
        <button onClick={()=>{if(!name||!username||!password)return alert('Fill all fields');onAdd({name,username,password,role,active:true});setName('');setUsername('');setPassword('');setRole('staff')}}
          style={{ padding:'10px 24px', background:gold, color:'#0A0A0A', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Add Account</button>
      </div>

      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>All accounts</div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {staffList.filter(s=>s.role!=='admin').map(s=>(
          <div key={s.id} style={{ background:k2, border:'1px solid #333', borderRadius:12, padding:16, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:46, height:46, borderRadius:'50%', background:k3, border:'2px solid #C9A84C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:gold, flexShrink:0 }}>{initials(s.name)}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700, color:w }}>{s.name}</div>
              <div style={{ fontSize:12, color:mu, marginTop:3 }}>@{s.username}</div>
              <div style={{ fontSize:11, marginTop:4 }}>
                <span style={{ background: s.role==='management'?'#1A0A2A':'#0A1A0A', color: s.role==='management'?'#A07CC5':'#6DBF6D', padding:'2px 8px', borderRadius:20, fontWeight:600 }}>
                  {s.role==='management'?'Management':'Staff'}
                </span>
              </div>
            </div>
            <button onClick={()=>onRemove(s.id)} style={{ padding:'8px 16px', background:'transparent', border:'1px solid #4A1A1A', borderRadius:8, color:'#E07070', fontSize:13, cursor:'pointer', fontWeight:600 }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
