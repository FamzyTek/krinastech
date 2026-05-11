import { useState, useEffect } from 'react'

const fmt = n => '\u20A6' + Number(Math.round(n)).toLocaleString()
const gold = '#C9A84C'
const k2 = '#141414'
const k3 = '#1C1C1C'
const mu = '#8A8070'
const w = '#F5F0E8'

export default function AdminDashboard({ currentUser, products, sales, staffList, page, setPage, onDeleteSale, onUpdateSale, onAddProduct, onUpdateProduct, onDeleteProduct, onAddStaff, onRemoveStaff, onLogout }) {
  const [editSale, setEditSale] = useState(null)
  const [editProd, setEditProd] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const [mobile, setMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const totalRev = sales.reduce((a, s) => a + s.total, 0)
  const totalProfit = sales.reduce((a, s) => a + s.profit, 0)
  const totalStock = products.reduce((a, p) => a + p.cost * p.qty, 0)
  const lowCount = products.filter(p => p.qty <= 3).length
  const today = new Date().toISOString().split('T')[0]
  const todaySales = sales.filter(s => s.date === today)
  const todayRev = todaySales.reduce((a, s) => a + s.total, 0)

  const nav = [
    { id:'overview', icon:'Home', label:'Home' },
    { id:'stock', icon:'Stock', label:'Stock' },
    { id:'sales', icon:'Sales', label:'Sales' },
    { id:'profit', icon:'Profit', label:'Profit' },
    { id:'staff', icon:'Staff', label:'Staff' },
  ]

  function resetModals() { setEditSale(null); setEditProd(null); setConfirmDel(null) }

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', flexDirection:'column' }}>

      {/* TOPBAR */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 18px', height:52, background:k2, borderBottom:'1px solid #222', flexShrink:0, position:'sticky', top:0, zIndex:200 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src="/icon-512.png" alt="logo" onError={e=>e.target.style.display='none'} style={{ width:28, height:28, borderRadius:6, objectFit:'contain' }} />
          <span style={{ fontSize:15, fontWeight:700, color:gold, letterSpacing:1 }}>KRINAS TECH</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'#2A1F00', color:gold, border:'1px solid #A07830', fontWeight:600 }}>Admin</span>
          {!mobile && <span style={{ fontSize:13, color:w }}>{currentUser}</span>}
          <button onClick={onLogout} style={{ fontSize:12, padding:'6px 12px', background:'transparent', border:'1px solid #333', borderRadius:6, color:w, cursor:'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {/* DESKTOP TOP NAV */}
      {!mobile && (
        <div style={{ display:'flex', gap:2, padding:'0 18px', background:k3, borderBottom:'1px solid #222', flexShrink:0, position:'sticky', top:52, zIndex:100 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); resetModals() }}
              style={{ padding:'12px 20px', fontSize:13, border:'none', background:'transparent', cursor:'pointer', color: page === n.id ? gold : w, fontWeight: page === n.id ? 700 : 400, borderBottom: page === n.id ? '2px solid #C9A84C' : '2px solid transparent', whiteSpace:'nowrap' }}>
              {n.label}
            </button>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding: mobile ? '12px 12px 80px' : '20px', WebkitOverflowScrolling:'touch' }}>

        {editSale && <EditSaleModal sale={editSale} onSave={updates => { onUpdateSale(editSale.id, updates); resetModals(); setPage('sales') }} onCancel={resetModals} />}
        {confirmDel && <ConfirmDeleteModal sale={confirmDel} onConfirm={() => { onDeleteSale(confirmDel.id); resetModals() }} onCancel={resetModals} />}
        {editProd && <EditProductModal product={editProd} onSave={updates => { onUpdateProduct(editProd.id, updates); resetModals(); setPage('stock') }} onCancel={resetModals} />}

        {!editSale && !confirmDel && !editProd && page === 'overview' && <OverviewPage products={products} sales={sales} totalStock={totalStock} totalRev={totalRev} totalProfit={totalProfit} lowCount={lowCount} todayRev={todayRev} todaySales={todaySales} onEditSale={setEditSale} onDeleteSale={setConfirmDel} mobile={mobile} />}
        {!editSale && !confirmDel && !editProd && page === 'stock' && <AddProductForm onAdd={onAddProduct} products={products} onEdit={setEditProd} onDelete={id => { if(window.confirm('Delete?')) onDeleteProduct(id) }} onRestock={(id, qty) => onUpdateProduct(id, { qty })} mobile={mobile} />}
        {!editSale && !confirmDel && !editProd && page === 'sales' && <SalesPage sales={sales} onEdit={setEditSale} onDelete={setConfirmDel} mobile={mobile} />}
        {!editSale && !confirmDel && !editProd && page === 'profit' && <ProfitPage sales={sales} mobile={mobile} />}
        {!editSale && !confirmDel && !editProd && page === 'staff' && <StaffPage staffList={staffList} onAdd={onAddStaff} onRemove={id => { if(window.confirm('Remove?')) onRemoveStaff(id) }} mobile={mobile} />}
      </div>

      {/* MOBILE BOTTOM NAV */}
      {mobile && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:k2, borderTop:'1px solid #2A2A2A', display:'flex', zIndex:100 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); resetModals() }}
              style={{ flex:1, padding:'8px 4px 10px', background:'transparent', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <span style={{ fontSize:11, color: page === n.id ? gold : mu, fontWeight: page === n.id ? 700 : 400 }}>{n.label}</span>
              {page === n.id && <div style={{ width:4, height:4, borderRadius:'50%', background:gold }}></div>}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

function OverviewPage({ products, sales, totalStock, totalRev, totalProfit, lowCount, todayRev, todaySales, onEditSale, onDeleteSale, mobile }) {
  return (
    <div>
      <div style={{ display:'flex', overflowX:'auto', gap:12, marginBottom:20, paddingBottom:4, WebkitOverflowScrolling:'touch' }}>
        {[['Stock Value', fmt(totalStock), products.length+' products', gold],
          ['Revenue', fmt(totalRev), 'All time', w],
          ['Net Profit', fmt(totalProfit), 'All time', '#6DBF6D'],
          ['Today', fmt(todayRev), todaySales.length+' sales', w],
          ['Low/Out', lowCount, 'Need restock', '#E07070']].map(([label,val,sub,color])=>(
          <div key={label} style={{ background:k2, border:'1px solid #333', borderRadius:12, padding:16, minWidth:150, flexShrink:0 }}>
            <div style={{ fontSize:12, color:mu, letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:700, color }}>{val}</div>
            <div style={{ fontSize:12, color:mu, marginTop:4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Recent transactions</div>
      <div style={{ background:k2, border:'1px solid #333', borderRadius:12, overflowX:'auto', marginBottom:20, WebkitOverflowScrolling:'touch' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14, minWidth:500 }}>
          <thead><tr style={{ background:k3 }}>
            {['Items','Staff','Total','Profit','Date','Actions'].map(h=><th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:12, color:gold, borderBottom:'1px solid #333', whiteSpace:'nowrap', fontWeight:700 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {sales.length === 0
              ? <tr><td colSpan={6} style={{ padding:'2rem', textAlign:'center', color:mu }}>No sales recorded yet</td></tr>
              : sales.slice(0,6).map(s=>{
                const items=s.items.map(i=>i.name+(i.qty>1?' x'+i.qty:'')).join(', ')
                return(
                  <tr key={s.id} style={{ borderBottom:'1px solid #222' }}>
                    <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', fontWeight:600 }} title={items}>{items}</td>
                    <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{s.staff}</td>
                    <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{fmt(s.total)}</td>
                    <td style={{ padding:'12px 16px', color:'#6DBF6D', fontWeight:700, whiteSpace:'nowrap' }}>{fmt(s.profit)}</td>
                    <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{s.date}</td>
                    <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                      <button onClick={()=>onEditSale(s)} style={{ marginRight:6, padding:'5px 12px', background:'transparent', border:'1px solid #2A3A1A', borderRadius:6, color:'#D4A040', fontSize:12, cursor:'pointer', fontWeight:600 }}>Edit</button>
                      <button onClick={()=>onDeleteSale(s)} style={{ padding:'5px 12px', background:'transparent', border:'1px solid #4A1A1A', borderRadius:6, color:'#E07070', fontSize:12, cursor:'pointer', fontWeight:600 }}>Del</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>

      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Stock alerts</div>
      {products.filter(p=>p.qty<=3).length===0
        ?<div style={{ background:'#0A2A0A', border:'1px solid #1A4A1A', color:'#6DBF6D', padding:'12px 16px', borderRadius:10, fontSize:14, fontWeight:600 }}>All products well stocked</div>
        :products.filter(p=>p.qty<=3).map(p=>(
          <div key={p.id} style={{ background:p.qty===0?'#2A0A0A':'#2A1A00', border:`1px solid ${p.qty===0?'#4A1A1A':'#4A3000'}`, color:p.qty===0?'#E07070':'#D4A040', padding:'12px 16px', borderRadius:10, fontSize:14, fontWeight:600, marginBottom:8 }}>
            {p.name} -- {p.qty} unit(s) left
          </div>
        ))
      }
    </div>
  )
}

function EditSaleModal({ sale, onSave, onCancel }) {
  const [staff, setStaff] = useState(sale.staff)
  const [total, setTotal] = useState(sale.total)
  const [profit, setProfit] = useState(sale.profit)
  const [date, setDate] = useState(sale.date)
  const items = sale.items.map(i=>i.name+(i.qty>1?' x'+i.qty:'')).join(', ')
  const inp = { width:'100%', padding:'10px 12px', background:k3, border:'1px solid #444', borderRadius:8, color:w, fontSize:14, marginBottom:14, outline:'none' }
  return (
    <div style={{ background:'rgba(0,0,0,0.9)', position:'fixed', top:0, left:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', padding:16, zIndex:300 }}>
      <div style={{ background:k2, border:'1px solid #C9A84C', borderRadius:14, padding:24, width:'100%', maxWidth:420 }}>
        <div style={{ fontSize:16, fontWeight:700, color:gold, marginBottom:16 }}>Edit Sale Entry</div>
        <div style={{ background:k3, borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:w, fontWeight:600 }}>{items}</div>
        <label style={{ fontSize:12, color:mu, display:'block', marginBottom:5, fontWeight:600 }}>Staff name</label>
        <input style={inp} value={staff} onChange={e=>setStaff(e.target.value)} />
        <label style={{ fontSize:12, color:mu, display:'block', marginBottom:5, fontWeight:600 }}>Total revenue</label>
        <input type="number" style={inp} value={total} onChange={e=>setTotal(e.target.value)} />
        <label style={{ fontSize:12, color:mu, display:'block', marginBottom:5, fontWeight:600 }}>Profit</label>
        <input type="number" style={inp} value={profit} onChange={e=>setProfit(e.target.value)} />
        <label style={{ fontSize:12, color:mu, display:'block', marginBottom:5, fontWeight:600 }}>Date</label>
        <input type="date" style={inp} value={date} onChange={e=>setDate(e.target.value)} />
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:12, background:'transparent', border:'1px solid #333', borderRadius:8, color:w, cursor:'pointer', fontSize:14 }}>Cancel</button>
          <button onClick={()=>onSave({staff,total:parseFloat(total),profit:parseFloat(profit),date})} style={{ flex:1, padding:12, background:gold, color:'#0A0A0A', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:14 }}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

function ConfirmDeleteModal({ sale, onConfirm, onCancel }) {
  const items = sale.items.map(i=>i.name+(i.qty>1?' x'+i.qty:'')).join(', ')
  return (
    <div style={{ background:'rgba(0,0,0,0.9)', position:'fixed', top:0, left:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', padding:16, zIndex:300 }}>
      <div style={{ background:k2, border:'1px solid #C9A84C', borderRadius:14, padding:24, width:'100%', maxWidth:400 }}>
        <div style={{ fontSize:16, fontWeight:700, color:'#E07070', marginBottom:16 }}>Confirm Delete</div>
        <div style={{ background:k3, borderRadius:8, padding:'12px 14px', marginBottom:14, fontSize:14, color:w, fontWeight:600 }}>{items}</div>
        <div style={{ fontSize:13, color:'#E07070', marginBottom:18, fontWeight:600 }}>This action cannot be undone.</div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:12, background:'transparent', border:'1px solid #333', borderRadius:8, color:w, cursor:'pointer', fontSize:14 }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:12, background:'#8B2E2E', color:w, border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:14 }}>Yes, Delete</button>
        </div>
      </div>
    </div>
  )
}

function EditProductModal({ product, onSave, onCancel }) {
  const [name, setName] = useState(product.name)
  const [cat, setCat] = useState(product.category)
  const [cost, setCost] = useState(product.cost)
  const [sell, setSell] = useState(product.sell)
  const [qty, setQty] = useState(product.qty)
  const inp = { width:'100%', padding:'10px 12px', background:k3, border:'1px solid #444', borderRadius:8, color:w, fontSize:14, marginBottom:14, outline:'none' }
  return (
    <div style={{ background:'rgba(0,0,0,0.9)', position:'fixed', top:0, left:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', padding:16, zIndex:300 }}>
      <div style={{ background:k2, border:'1px solid #C9A84C', borderRadius:14, padding:24, width:'100%', maxWidth:420 }}>
        <div style={{ fontSize:16, fontWeight:700, color:gold, marginBottom:16 }}>Edit Product</div>
        {[['Product name',name,setName,'text'],['Category',cat,setCat,'text'],['Cost price',cost,setCost,'number'],['Selling price',sell,setSell,'number'],['Quantity',qty,setQty,'number']].map(([label,val,setter,type])=>(
          <div key={label}>
            <label style={{ fontSize:12, color:mu, display:'block', marginBottom:5, fontWeight:600 }}>{label}</label>
            <input type={type} style={inp} value={val} onChange={e=>setter(e.target.value)} />
          </div>
        ))}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:12, background:'transparent', border:'1px solid #333', borderRadius:8, color:w, cursor:'pointer', fontSize:14 }}>Cancel</button>
          <button onClick={()=>onSave({name,category:cat,cost:parseFloat(cost),sell:parseFloat(sell),qty:parseInt(qty)})} style={{ flex:1, padding:12, background:gold, color:'#0A0A0A', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:14 }}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

function AddProductForm({ onAdd, products, onEdit, onDelete, onRestock, mobile }) {
  const [name,setName]=useState('')
  const [cat,setCat]=useState('')
  const [cost,setCost]=useState('')
  const [sell,setSell]=useState('')
  const [qty,setQty]=useState('')
  const inp = { width:'100%', padding:'10px 12px', background:k3, border:'1px solid #444', borderRadius:8, color:w, fontSize:14, outline:'none' }

  function handleAdd(){
    if(!name||!cat||!cost||!sell||!qty)return alert('Fill all fields')
    onAdd({name,category:cat,cost:parseFloat(cost),sell:parseFloat(sell),qty:parseInt(qty)})
    setName('');setCat('');setCost('');setSell('');setQty('')
  }

  return(
    <div>
      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Add product</div>
      <div style={{ background:k2, border:'1px solid #333', borderRadius:12, padding:16, marginBottom:16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10, marginBottom:12 }}>
          {[['Product name',name,setName,'text'],['Category',cat,setCat,'text'],['Cost price',cost,setCost,'number'],['Selling price',sell,setSell,'number'],['Quantity',qty,setQty,'number']].map(([ph,val,setter,type])=>(
            <input key={ph} type={type} placeholder={ph} value={val} onChange={e=>setter(e.target.value)} style={inp} />
          ))}
        </div>
        <button onClick={handleAdd} style={{ padding:'10px 24px', background:gold, color:'#0A0A0A', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Add Product</button>
      </div>

      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>All inventory</div>
      <div style={{ background:k2, border:'1px solid #333', borderRadius:12, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14, minWidth:600 }}>
          <thead><tr style={{ background:k3 }}>
            {['Product','Category','Cost','Sell Price','Qty','Status','Actions'].map(h=><th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:12, color:gold, borderBottom:'1px solid #333', whiteSpace:'nowrap', fontWeight:700 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {products.map(p=>(
              <tr key={p.id} style={{ borderBottom:'1px solid #222' }}>
                <td style={{ padding:'12px 16px', color:w, fontWeight:700, whiteSpace:'nowrap', fontSize:14 }}>{p.name}</td>
                <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{p.category}</td>
                <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{fmt(p.cost)}</td>
                <td style={{ padding:'12px 16px', color:gold, whiteSpace:'nowrap', fontWeight:700 }}>{fmt(p.sell)}</td>
                <td style={{ padding:'12px 16px', color:w, fontWeight:700, whiteSpace:'nowrap', fontSize:15 }}>{p.qty}</td>
                <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                  {p.qty===0?<span style={{ background:'#2A0A0A', color:'#E07070', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>Out</span>
                    :p.qty<=3?<span style={{ background:'#2A1A00', color:'#D4A040', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>Low</span>
                    :<span style={{ background:'#0A2A0A', color:'#6DBF6D', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>Good</span>}
                </td>
                <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                  <button onClick={()=>onEdit(p)} style={{ marginRight:6, padding:'6px 12px', background:'transparent', border:'1px solid #2A3A1A', borderRadius:6, color:'#D4A040', fontSize:12, cursor:'pointer', fontWeight:600 }}>Edit</button>
                  <button onClick={()=>{const a=prompt('Add how many units?');if(a&&parseInt(a)>0)onRestock(p.id,p.qty+parseInt(a))}} style={{ marginRight:6, padding:'6px 12px', background:'transparent', border:'1px solid #444', borderRadius:6, color:w, fontSize:12, cursor:'pointer', fontWeight:600 }}>+Stock</button>
                  <button onClick={()=>onDelete(p.id)} style={{ padding:'6px 12px', background:'transparent', border:'1px solid #4A1A1A', borderRadius:6, color:'#E07070', fontSize:12, cursor:'pointer', fontWeight:600 }}>Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SalesPage({ sales, onEdit, onDelete, mobile }) {
  const staffSum={}
  sales.forEach(s=>{
    if(!staffSum[s.staff])staffSum[s.staff]={count:0,total:0,profit:0}
    staffSum[s.staff].count++;staffSum[s.staff].total+=s.total;staffSum[s.staff].profit+=s.profit
  })
  return(
    <div>
      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Sales by staff</div>
      <div style={{ background:k2, border:'1px solid #333', borderRadius:12, overflowX:'auto', WebkitOverflowScrolling:'touch', marginBottom:16 }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14, minWidth:400 }}>
          <thead><tr style={{ background:k3 }}>
            {['Staff','Transactions','Revenue','Profit Generated'].map(h=><th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:12, color:gold, borderBottom:'1px solid #333', whiteSpace:'nowrap', fontWeight:700 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {Object.entries(staffSum).map(([name,s])=>(
              <tr key={name} style={{ borderBottom:'1px solid #222' }}>
                <td style={{ padding:'12px 16px', color:w, fontWeight:700, whiteSpace:'nowrap' }}>{name}</td>
                <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{s.count}</td>
                <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{fmt(s.total)}</td>
                <td style={{ padding:'12px 16px', color:'#6DBF6D', fontWeight:700, whiteSpace:'nowrap' }}>{fmt(s.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>All transactions</div>
      <div style={{ background:k2, border:'1px solid #333', borderRadius:12, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14, minWidth:580 }}>
          <thead><tr style={{ background:k3 }}>
            {['Items','Staff','Total','Profit','Date','Actions'].map(h=><th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:12, color:gold, borderBottom:'1px solid #333', whiteSpace:'nowrap', fontWeight:700 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {sales.map(s=>{
              const items=s.items.map(i=>i.name+(i.qty>1?' x'+i.qty:'')).join(', ')
              return(
                <tr key={s.id} style={{ borderBottom:'1px solid #222' }}>
                  <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', fontWeight:600 }} title={items}>{items}</td>
                  <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{s.staff}</td>
                  <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{fmt(s.total)}</td>
                  <td style={{ padding:'12px 16px', color:'#6DBF6D', fontWeight:700, whiteSpace:'nowrap' }}>{fmt(s.profit)}</td>
                  <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{s.date}</td>
                  <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                    <button onClick={()=>onEdit(s)} style={{ marginRight:6, padding:'6px 12px', background:'transparent', border:'1px solid #2A3A1A', borderRadius:6, color:'#D4A040', fontSize:12, cursor:'pointer', fontWeight:600 }}>Edit</button>
                    <button onClick={()=>onDelete(s)} style={{ padding:'6px 12px', background:'transparent', border:'1px solid #4A1A1A', borderRadius:6, color:'#E07070', fontSize:12, cursor:'pointer', fontWeight:600 }}>Del</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProfitPage({ sales, mobile }) {
  const totalRev=sales.reduce((a,s)=>a+s.total,0)
  const totalProfit=sales.reduce((a,s)=>a+s.profit,0)
  const margin=totalRev>0?Math.round(totalProfit/totalRev*100):0
  const pg={}
  sales.forEach(s=>{
    s.items.forEach(it=>{if(!pg[it.name])pg[it.name]={qty:0,rev:0,profit:0};pg[it.name].qty+=it.qty;pg[it.name].rev+=it.price})
    const pf=s.profit/s.items.length
    s.items.forEach(it=>{pg[it.name].profit+=pf})
  })
  return(
    <div>
      <div style={{ display:'flex', overflowX:'auto', gap:12, marginBottom:20, paddingBottom:4, WebkitOverflowScrolling:'touch' }}>
        {[['Total Revenue',fmt(totalRev),'All time',w],['Total Cost',fmt(totalRev-totalProfit),'Cost of goods',w],['Net Profit',fmt(totalProfit),'All time','#6DBF6D'],['Profit Margin',margin+'%','Overall',gold]].map(([label,val,sub,color])=>(
          <div key={label} style={{ background:k2, border:'1px solid #333', borderRadius:12, padding:16, minWidth:150, flexShrink:0 }}>
            <div style={{ fontSize:12, color:mu, letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:700, color }}>{val}</div>
            <div style={{ fontSize:12, color:mu, marginTop:4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Profit by product</div>
      <div style={{ background:k2, border:'1px solid #333', borderRadius:12, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14, minWidth:480 }}>
          <thead><tr style={{ background:k3 }}>
            {['Product','Units Sold','Revenue','Est. Profit','Margin'].map(h=><th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:12, color:gold, borderBottom:'1px solid #333', whiteSpace:'nowrap', fontWeight:700 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {Object.entries(pg).map(([name,r])=>{
              const m=r.rev>0?Math.round(r.profit/r.rev*100):0
              return(
                <tr key={name} style={{ borderBottom:'1px solid #222' }}>
                  <td style={{ padding:'12px 16px', color:w, fontWeight:700, whiteSpace:'nowrap' }}>{name}</td>
                  <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{r.qty}</td>
                  <td style={{ padding:'12px 16px', color:w, whiteSpace:'nowrap', fontWeight:600 }}>{fmt(r.rev)}</td>
                  <td style={{ padding:'12px 16px', color:'#6DBF6D', fontWeight:700, whiteSpace:'nowrap' }}>{fmt(r.profit)}</td>
                  <td style={{ padding:'12px 16px', color:gold, fontWeight:700, whiteSpace:'nowrap' }}>{m}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StaffPage({ staffList, onAdd, onRemove, mobile }) {
  const [name,setName]=useState('')
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  function initials(n){const p=n.split(' ');return(p[0][0]+(p[1]?p[1][0]:'')).toUpperCase()}
  const inp = { width:'100%', padding:'10px 12px', background:k3, border:'1px solid #444', borderRadius:8, color:w, fontSize:14, outline:'none' }
  return(
    <div>
      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Add staff account</div>
      <div style={{ background:k2, border:'1px solid #333', borderRadius:12, padding:16, marginBottom:16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10, marginBottom:12 }}>
          {[['Full name',name,setName,'text'],['Username',username,setUsername,'text'],['Password',password,setPassword,'password']].map(([ph,val,setter,type])=>(
            <input key={ph} type={type} placeholder={ph} value={val} onChange={e=>setter(e.target.value)} style={inp} />
          ))}
        </div>
        <button onClick={()=>{if(!name||!username||!password)return alert('Fill all fields');onAdd({name,username,password,role:'staff',active:true});setName('');setUsername('');setPassword('')}} style={{ padding:'10px 24px', background:gold, color:'#0A0A0A', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Add Staff</button>
      </div>

      <div style={{ fontSize:13, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Staff accounts</div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {staffList.filter(s=>s.role==='staff').map(s=>(
          <div key={s.id} style={{ background:k2, border:'1px solid #333', borderRadius:12, padding:16, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:46, height:46, borderRadius:'50%', background:k3, border:'2px solid #C9A84C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:gold, flexShrink:0 }}>{initials(s.name)}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700, color:w }}>{s.name}</div>
              <div style={{ fontSize:12, color:mu, textTransform:'uppercase', letterSpacing:1, marginTop:3 }}>@{s.username}</div>
              <div style={{ fontSize:12, color:'#6DBF6D', marginTop:4, fontWeight:600 }}>Active</div>
            </div>
            <button onClick={()=>onRemove(s.id)} style={{ padding:'8px 16px', background:'transparent', border:'1px solid #4A1A1A', borderRadius:8, color:'#E07070', fontSize:13, cursor:'pointer', fontWeight:600 }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}