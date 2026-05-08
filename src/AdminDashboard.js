import { useState } from 'react'

const fmt = n => '₦' + Number(Math.round(n)).toLocaleString()
const gold = '#C9A84C'
const k2 = '#141414'
const k3 = '#1C1C1C'
const mu = '#8A8070'
const w = '#F5F0E8'

export default function AdminDashboard({ currentUser, products, sales, staffList, page, setPage, onDeleteSale, onUpdateSale, onAddProduct, onUpdateProduct, onDeleteProduct, onAddStaff, onRemoveStaff, onLogout }) {
  const [editSale, setEditSale] = useState(null)
  const [editProd, setEditProd] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)

  const nav = [
    { id:'overview', label:'Overview' },
    { id:'stock', label:'Stock' },
    { id:'sales', label:'Sales' },
    { id:'profit', label:'Profit' },
    { id:'staff', label:'Staff' },
  ]

  const totalRev = sales.reduce((a, s) => a + s.total, 0)
  const totalProfit = sales.reduce((a, s) => a + s.profit, 0)
  const totalStock = products.reduce((a, p) => a + p.cost * p.qty, 0)
  const lowCount = products.filter(p => p.qty <= 3).length
  const today = new Date().toISOString().split('T')[0]
  const todaySales = sales.filter(s => s.date === today)
  const todayRev = todaySales.reduce((a, s) => a + s.total, 0)

  

  function MetricCard({ label, value, sub, color }) {
    return (
      <div style={{ background:k2, border:'1px solid #222', borderRadius:10, padding:14 }}>
        <div style={{ fontSize:11, color:mu, letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>{label}</div>
        <div style={{ fontSize:22, fontWeight:700, color: color || w }}>{value}</div>
        <div style={{ fontSize:11, color:mu, marginTop:3 }}>{sub}</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 18px', height:50, background:k2, borderBottom:'1px solid #222' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:18, color:gold }}>⚡</span>
          <span style={{ fontSize:15, fontWeight:700, color:gold, letterSpacing:2, textTransform:'uppercase' }}>Krinas Tech</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'#2A1F00', color:gold, border:'1px solid #A07830', letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>Admin</span>
          <span style={{ fontSize:12, color:mu }}>{currentUser}</span>
          <button onClick={onLogout} style={{ fontSize:11, padding:'5px 10px', background:'transparent', border:'1px solid #333', borderRadius:6, color:mu, cursor:'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ display:'flex', gap:2, padding:'0 18px', background:k3, borderBottom:'1px solid #222', overflowX:'auto' }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => { setPage(n.id); setEditSale(null); setEditProd(null); setConfirmDel(null) }}
            style={{ padding:'11px 16px', fontSize:11, border:'none', background:'transparent', cursor:'pointer', color: page === n.id ? gold : mu, letterSpacing:1, textTransform:'uppercase', borderBottom: page === n.id ? '2px solid #C9A84C' : '2px solid transparent', whiteSpace:'nowrap' }}>
            {n.label}
          </button>
        ))}
      </div>

      <div style={{ padding:16, flex:1 }}>

        {editSale && (
          <EditSaleModal sale={editSale} onSave={updates => { onUpdateSale(editSale.id, updates); setEditSale(null); setPage('sales') }} onCancel={() => setEditSale(null)} />
        )}

        {confirmDel && (
          <ConfirmDeleteModal sale={confirmDel} onConfirm={() => { onDeleteSale(confirmDel.id); setConfirmDel(null) }} onCancel={() => setConfirmDel(null)} />
        )}

        {editProd && (
          <EditProductModal product={editProd} onSave={updates => { onUpdateProduct(editProd.id, updates); setEditProd(null); setPage('stock') }} onCancel={() => setEditProd(null)} />
        )}

        {!editSale && !confirmDel && !editProd && page === 'overview' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10, marginBottom:16 }}>
              <MetricCard label="Stock Value" value={fmt(totalStock)} sub={products.length + ' products'} color={gold} />
              <MetricCard label="Total Revenue" value={fmt(totalRev)} sub="All time" />
              <MetricCard label="Net Profit" value={fmt(totalProfit)} sub="All time" color="#6DBF6D" />
              <MetricCard label="Today" value={fmt(todayRev)} sub={todaySales.length + ' sales'} />
              <MetricCard label="Low/Out" value={lowCount} sub="Need restock" color="#E07070" />
            </div>
            <div style={{ fontSize:12, fontWeight:600, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Recent transactions</div>
            <div style={{ background:k2, border:'1px solid #222', borderRadius:10, overflowX:'auto', marginBottom:14 }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead><tr style={{ background:k3 }}>
                  {['Items','Staff','Total','Profit','Date','Actions'].map(h => (
                    <th key={h} style={{ textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:600, color:mu, borderBottom:'1px solid #222', letterSpacing:1, textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {sales.slice(0,6).map(s => {
                    const items = s.items.map(i => i.name + (i.qty > 1 ? ' x' + i.qty : '')).join(', ')
                    return (
                      <tr key={s.id} style={{ borderBottom:'1px solid #1A1A1A' }}>
                        <td style={{ padding:'9px 12px', color:w, maxWidth:180, overflowX:'auto', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={items}>{items}</td>
                        <td style={{ padding:'9px 12px', color:w }}>{s.staff}</td>
                        <td style={{ padding:'9px 12px', color:w }}>{fmt(s.total)}</td>
                        <td style={{ padding:'9px 12px', color:gold, fontWeight:600 }}>{fmt(s.profit)}</td>
                        <td style={{ padding:'9px 12px', color:w }}>{s.date}</td>
                        <td style={{ padding:'9px 12px' }}>
                          <button onClick={() => setEditSale(s)} style={{ marginRight:4, padding:'4px 8px', background:'transparent', border:'1px solid #2A3A1A', borderRadius:6, color:'#D4A040', fontSize:11, cursor:'pointer' }}>Edit</button>
                          <button onClick={() => setConfirmDel(s)} style={{ padding:'4px 8px', background:'transparent', border:'1px solid #4A1A1A', borderRadius:6, color:'#E07070', fontSize:11, cursor:'pointer' }}>Del</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize:12, fontWeight:600, color:gold, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Stock alerts</div>
            {products.filter(p => p.qty <= 3).length === 0
              ? <div style={{ background:'#0A2A0A', border:'1px solid #1A4A1A', color:'#6DBF6D', padding:'10px 12px', borderRadius:8, fontSize:12 }}>✓ All products well stocked</div>
              : products.filter(p => p.qty <= 3).map(p => (
                <div key={p.id} style={{ background: p.qty === 0 ? '#2A0A0A' : '#2A1A00', border:`1px solid ${p.qty === 0 ? '#4A1A1A' : '#4A3000'}`, color: p.qty === 0 ? '#E07070' : '#D4A040', padding:'10px 12px', borderRadius:8, fontSize:12, marginBottom:6 }}>
                  ⚠ <b>{p.name}</b> — {p.qty} unit(s) left
                </div>
              ))
            }
          </div>
        )}

        {!editSale && !confirmDel && !editProd && page === 'stock' && (
          <AddProductForm onAdd={onAddProduct} products={products} onEdit={setEditProd} onDelete={id => { if(window.confirm('Delete this product?')) onDeleteProduct(id) }} onRestock={(id, qty) => onUpdateProduct(id, { qty })} />
        )}

        {!editSale && !confirmDel && !editProd && page === 'sales' && (
          <SalesPage sales={sales} onEdit={setEditSale} onDelete={setConfirmDel} />
        )}

        {!editSale && !confirmDel && !editProd && page === 'profit' && (
          <ProfitPage sales={sales} />
        )}

        {!editSale && !confirmDel && !editProd && page === 'staff' && (
          <StaffPage staffList={staffList} onAdd={onAddStaff} onRemove={id => { if(window.confirm('Remove this staff?')) onRemoveStaff(id) }} />
        )}
      </div>
    </div>
  )
}

function EditSaleModal({ sale, onSave, onCancel }) {
  const [staff, setStaff] = useState(sale.staff)
  const [total, setTotal] = useState(sale.total)
  const [profit, setProfit] = useState(sale.profit)
  const [date, setDate] = useState(sale.date)
  const items = sale.items.map(i => i.name + (i.qty > 1 ? ' x' + i.qty : '')).join(', ')
  return (
    <div style={{ background:'rgba(0,0,0,0.88)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, minHeight:400 }}>
      <div style={{ background:'#141414', border:'1px solid #C9A84C', borderRadius:12, padding:22, width:'100%', maxWidth:400 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'#C9A84C', letterSpacing:2, textTransform:'uppercase', marginBottom:16 }}>✏ Edit Sale Entry</div>
        <div style={{ background:'#1C1C1C', borderRadius:8, padding:'10px 12px', marginBottom:14, fontSize:12, color:'#8A8070' }}>
          <div style={{ color:'#F5F0E8', fontWeight:600, marginBottom:4 }}>{items}</div>
        </div>
        {[['Staff name', staff, setStaff, 'text'], ['Total revenue (₦)', total, setTotal, 'number'], ['Profit (₦)', profit, setProfit, 'number'], ['Date', date, setDate, 'date']].map(([label, val, setter, type]) => (
          <div key={label} style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:'#8A8070', letterSpacing:1, textTransform:'uppercase', marginBottom:5 }}>{label}</div>
            <input type={type} value={val} onChange={e => setter(e.target.value)} style={{ width:'100%', padding:'8px 10px', background:'#1C1C1C', border:'1px solid #333', borderRadius:8, color:'#F5F0E8', fontSize:13 }} />
          </div>
        ))}
        <div style={{ display:'flex', gap:8, marginTop:16 }}>
          <button onClick={onCancel} style={{ flex:1, padding:9, background:'transparent', border:'1px solid #333', borderRadius:8, color:'#8A8070', fontSize:12, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>Cancel</button>
          <button onClick={() => onSave({ staff, total: parseFloat(total), profit: parseFloat(profit), date })} style={{ flex:1, padding:9, background:'#C9A84C', color:'#0A0A0A', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

function ConfirmDeleteModal({ sale, onConfirm, onCancel }) {
  const items = sale.items.map(i => i.name + (i.qty > 1 ? ' x' + i.qty : '')).join(', ')
  const fmt = n => '₦' + Number(Math.round(n)).toLocaleString()
  return (
    <div style={{ background:'rgba(0,0,0,0.88)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, minHeight:300 }}>
      <div style={{ background:'#141414', border:'1px solid #C9A84C', borderRadius:12, padding:22, width:'100%', maxWidth:400 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'#E07070', letterSpacing:2, textTransform:'uppercase', marginBottom:16 }}>⚠ Confirm Delete</div>
        <div style={{ background:'#1C1C1C', borderRadius:8, padding:12, marginBottom:14, fontSize:13, color:'#EDE8DC' }}>
          <b style={{ color:'#F5F0E8' }}>{items}</b><br />
          <span style={{ color:'#8A8070' }}>Staff: {sale.staff} | Total: {fmt(sale.total)} | {sale.date}</span>
        </div>
        <div style={{ fontSize:12, color:'#E07070', marginBottom:14 }}>⚠ This action cannot be undone.</div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onCancel} style={{ flex:1, padding:9, background:'transparent', border:'1px solid #333', borderRadius:8, color:'#8A8070', fontSize:12, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:9, background:'#8B2E2E', color:'#F5F0E8', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>Yes, Delete</button>
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
  return (
    <div style={{ background:'rgba(0,0,0,0.88)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, minHeight:400 }}>
      <div style={{ background:'#141414', border:'1px solid #C9A84C', borderRadius:12, padding:22, width:'100%', maxWidth:400 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'#C9A84C', letterSpacing:2, textTransform:'uppercase', marginBottom:16 }}>✏ Edit Product</div>
        {[['Product name', name, setName, 'text'], ['Category', cat, setCat, 'text'], ['Cost price (₦)', cost, setCost, 'number'], ['Selling price (₦)', sell, setSell, 'number'], ['Quantity', qty, setQty, 'number']].map(([label, val, setter, type]) => (
          <div key={label} style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:'#8A8070', letterSpacing:1, textTransform:'uppercase', marginBottom:5 }}>{label}</div>
            <input type={type} value={val} onChange={e => setter(e.target.value)} style={{ width:'100%', padding:'8px 10px', background:'#1C1C1C', border:'1px solid #333', borderRadius:8, color:'#F5F0E8', fontSize:13 }} />
          </div>
        ))}
        <div style={{ display:'flex', gap:8, marginTop:16 }}>
          <button onClick={onCancel} style={{ flex:1, padding:9, background:'transparent', border:'1px solid #333', borderRadius:8, color:'#8A8070', fontSize:12, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>Cancel</button>
          <button onClick={() => onSave({ name, category: cat, cost: parseFloat(cost), sell: parseFloat(sell), qty: parseInt(qty) })} style={{ flex:1, padding:9, background:'#C9A84C', color:'#0A0A0A', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

function AddProductForm({ onAdd, products, onEdit, onDelete, onRestock }) {
  const [name, setName] = useState(''); const [cat, setCat] = useState(''); const [cost, setCost] = useState(''); const [sell, setSell] = useState(''); const [qty, setQty] = useState('')
  const fmt = n => '₦' + Number(Math.round(n)).toLocaleString()
  function handleAdd() {
    if (!name || !cat || !cost || !sell || !qty) return alert('Fill all fields')
    onAdd({ name, category: cat, icon: 'ti-device-mobile', cost: parseFloat(cost), sell: parseFloat(sell), qty: parseInt(qty) })
    setName(''); setCat(''); setCost(''); setSell(''); setQty('')
  }
  return (
    <div>
      <div style={{ fontSize:12, fontWeight:600, color:'#C9A84C', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Add product</div>
      <div style={{ background:'#141414', border:'1px solid #222', borderRadius:10, padding:14, marginBottom:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:8, marginBottom:10 }}>
          {[['Product name', name, setName, 'text'], ['Category', cat, setCat, 'text'], ['Cost (₦)', cost, setCost, 'number'], ['Sell price (₦)', sell, setSell, 'number'], ['Qty', qty, setQty, 'number']].map(([ph, val, setter, type]) => (
            <input key={ph} type={type} placeholder={ph} value={val} onChange={e => setter(e.target.value)} style={{ width:'100%', padding:'8px 10px', background:'#1C1C1C', border:'1px solid #333', borderRadius:8, color:'#F5F0E8', fontSize:13 }} />
          ))}
        </div>
        <button onClick={handleAdd} style={{ padding:'8px 18px', background:'#C9A84C', color:'#0A0A0A', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>+ Add Product</button>
      </div>
      <div style={{ fontSize:12, fontWeight:600, color:'#C9A84C', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>All inventory</div>
      <div style={{ background:'#141414', border:'1px solid #222', borderRadius:10, overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ background:'#1C1C1C' }}>
            {['Product','Category','Cost','Sell','Qty','Status','Actions'].map(h => <th key={h} style={{ textAlign:'left', padding:'9px 12px', fontSize:11, fontWeight:600, color:'#8A8070', borderBottom:'1px solid #222', letterSpacing:1, textTransform:'uppercase' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom:'1px solid #1A1A1A' }}>
                <td style={{ padding:'9px 12px', color:'#F5F0E8', fontWeight:600 }}>{p.name}</td>
                <td style={{ padding:'9px 12px', color:'#EDE8DC' }}>{p.category}</td>
                <td style={{ padding:'9px 12px', color:'#EDE8DC' }}>{fmt(p.cost)}</td>
                <td style={{ padding:'9px 12px', color:'#EDE8DC' }}>{fmt(p.sell)}</td>
                <td style={{ padding:'9px 12px', color:'#F5F0E8', fontWeight:700 }}>{p.qty}</td>
                <td style={{ padding:'9px 12px' }}>
                  {p.qty === 0 ? <span style={{ background:'#2A0A0A', color:'#E07070', border:'1px solid #4A1A1A', padding:'2px 8px', borderRadius:20, fontSize:11 }}>Out</span>
                    : p.qty <= 3 ? <span style={{ background:'#2A1A00', color:'#D4A040', border:'1px solid #4A3000', padding:'2px 8px', borderRadius:20, fontSize:11 }}>Low</span>
                    : <span style={{ background:'#0A2A0A', color:'#6DBF6D', border:'1px solid #1A4A1A', padding:'2px 8px', borderRadius:20, fontSize:11 }}>Good</span>}
                </td>
                <td style={{ padding:'9px 12px' }}>
                  <button onClick={() => onEdit(p)} style={{ marginRight:3, padding:'4px 8px', background:'transparent', border:'1px solid #2A3A1A', borderRadius:6, color:'#D4A040', fontSize:11, cursor:'pointer' }}>Edit</button>
                  <button onClick={() => { const a = prompt('Add how many units?'); if (a && parseInt(a) > 0) onRestock(p.id, p.qty + parseInt(a)) }} style={{ marginRight:3, padding:'4px 8px', background:'transparent', border:'1px solid #333', borderRadius:6, color:'#8A8070', fontSize:11, cursor:'pointer' }}>+Stock</button>
                  <button onClick={() => onDelete(p.id)} style={{ padding:'4px 8px', background:'transparent', border:'1px solid #4A1A1A', borderRadius:6, color:'#E07070', fontSize:11, cursor:'pointer' }}>Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SalesPage({ sales, onEdit, onDelete }) {
  const fmt = n => '₦' + Number(Math.round(n)).toLocaleString()
  const staffSum = {}
  sales.forEach(s => {
    if (!staffSum[s.staff]) staffSum[s.staff] = { count: 0, total: 0, profit: 0 }
    staffSum[s.staff].count++; staffSum[s.staff].total += s.total; staffSum[s.staff].profit += s.profit
  })
  return (
    <div>
      <div style={{ fontSize:12, fontWeight:600, color:'#C9A84C', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Sales by staff</div>
      <div style={{ background:'#141414', border:'1px solid #222', borderRadius:10, overflowX:'auto', marginBottom:14 }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ background:'#1C1C1C' }}>
            {['Staff','Transactions','Revenue','Profit'].map(h => <th key={h} style={{ textAlign:'left', padding:'9px 12px', fontSize:11, color:'#8A8070', borderBottom:'1px solid #222', letterSpacing:1, textTransform:'uppercase' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {Object.entries(staffSum).map(([name, s]) => (
              <tr key={name} style={{ borderBottom:'1px solid #1A1A1A' }}>
                <td style={{ padding:'9px 12px', color:'#F5F0E8', fontWeight:600 }}>{name}</td>
                <td style={{ padding:'9px 12px', color:'#EDE8DC' }}>{s.count}</td>
                <td style={{ padding:'9px 12px', color:'#EDE8DC' }}>{fmt(s.total)}</td>
                <td style={{ padding:'9px 12px', color:'#C9A84C', fontWeight:600 }}>{fmt(s.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize:12, fontWeight:600, color:'#C9A84C', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>All transactions</div>
      <div style={{ background:'#141414', border:'1px solid #222', borderRadius:10, overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ background:'#1C1C1C' }}>
            {['Items','Staff','Total','Profit','Date','Actions'].map(h => <th key={h} style={{ textAlign:'left', padding:'9px 12px', fontSize:11, color:'#8A8070', borderBottom:'1px solid #222', letterSpacing:1, textTransform:'uppercase' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {sales.map(s => {
              const items = s.items.map(i => i.name + (i.qty > 1 ? ' x' + i.qty : '')).join(', ')
              return (
                <tr key={s.id} style={{ borderBottom:'1px solid #1A1A1A' }}>
                  <td style={{ padding:'9px 12px', color:'#F5F0E8', maxWidth:200, overflowX:'auto', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={items}>{items}</td>
                  <td style={{ padding:'9px 12px', color:'#EDE8DC' }}>{s.staff}</td>
                  <td style={{ padding:'9px 12px', color:'#EDE8DC' }}>{fmt(s.total)}</td>
                  <td style={{ padding:'9px 12px', color:'#C9A84C', fontWeight:600 }}>{fmt(s.profit)}</td>
                  <td style={{ padding:'9px 12px', color:'#EDE8DC' }}>{s.date}</td>
                  <td style={{ padding:'9px 12px' }}>
                    <button onClick={() => onEdit(s)} style={{ marginRight:4, padding:'4px 8px', background:'transparent', border:'1px solid #2A3A1A', borderRadius:6, color:'#D4A040', fontSize:11, cursor:'pointer' }}>Edit</button>
                    <button onClick={() => onDelete(s)} style={{ padding:'4px 8px', background:'transparent', border:'1px solid #4A1A1A', borderRadius:6, color:'#E07070', fontSize:11, cursor:'pointer' }}>Del</button>
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

function ProfitPage({ sales }) {
  const fmt = n => '₦' + Number(Math.round(n)).toLocaleString()
  const totalRev = sales.reduce((a, s) => a + s.total, 0)
  const totalProfit = sales.reduce((a, s) => a + s.profit, 0)
  const margin = totalRev > 0 ? Math.round(totalProfit / totalRev * 100) : 0
  const pg = {}
  sales.forEach(s => {
    s.items.forEach(it => { if (!pg[it.name]) pg[it.name] = { qty: 0, rev: 0, profit: 0 }; pg[it.name].qty += it.qty; pg[it.name].rev += it.price })
    const pf = s.profit / s.items.length
    s.items.forEach(it => { pg[it.name].profit += pf })
  })
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10, marginBottom:16 }}>
        {[['Total Revenue', fmt(totalRev), 'All time', '#F5F0E8'], ['Total Cost', fmt(totalRev - totalProfit), 'Cost of goods', '#F5F0E8'], ['Net Profit', fmt(totalProfit), 'All time', '#6DBF6D'], ['Profit Margin', margin + '%', 'Overall', '#C9A84C']].map(([label, val, sub, color]) => (
          <div key={label} style={{ background:'#141414', border:'1px solid #222', borderRadius:10, padding:14 }}>
            <div style={{ fontSize:11, color:'#8A8070', letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:700, color }}>{val}</div>
            <div style={{ fontSize:11, color:'#8A8070', marginTop:3 }}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:12, fontWeight:600, color:'#C9A84C', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Profit by product</div>
      <div style={{ background:'#141414', border:'1px solid #222', borderRadius:10, overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead><tr style={{ background:'#1C1C1C' }}>
            {['Product','Units Sold','Revenue','Est. Profit','Margin'].map(h => <th key={h} style={{ textAlign:'left', padding:'9px 12px', fontSize:11, color:'#8A8070', borderBottom:'1px solid #222', letterSpacing:1, textTransform:'uppercase' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {Object.entries(pg).map(([name, r]) => {
              const m = r.rev > 0 ? Math.round(r.profit / r.rev * 100) : 0
              return (
                <tr key={name} style={{ borderBottom:'1px solid #1A1A1A' }}>
                  <td style={{ padding:'9px 12px', color:'#F5F0E8', fontWeight:600 }}>{name}</td>
                  <td style={{ padding:'9px 12px', color:'#EDE8DC' }}>{r.qty}</td>
                  <td style={{ padding:'9px 12px', color:'#EDE8DC' }}>{fmt(r.rev)}</td>
                  <td style={{ padding:'9px 12px', color:'#C9A84C', fontWeight:600 }}>{fmt(r.profit)}</td>
                  <td style={{ padding:'9px 12px', color:'#C9A84C', fontWeight:600 }}>{m}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StaffPage({ staffList, onAdd, onRemove }) {
  const [name, setName] = useState(''); const [username, setUsername] = useState(''); const [password, setPassword] = useState('')
  function initials(n) { const p = n.split(' '); return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase() }
  return (
    <div>
      <div style={{ fontSize:12, fontWeight:600, color:'#C9A84C', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Add staff account</div>
      <div style={{ background:'#141414', border:'1px solid #222', borderRadius:10, padding:14, marginBottom:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:8, marginBottom:10 }}>
          {[['Full name', name, setName, 'text'], ['Username', username, setUsername, 'text'], ['Password', password, setPassword, 'password']].map(([ph, val, setter, type]) => (
            <input key={ph} type={type} placeholder={ph} value={val} onChange={e => setter(e.target.value)} style={{ width:'100%', padding:'8px 10px', background:'#1C1C1C', border:'1px solid #333', borderRadius:8, color:'#F5F0E8', fontSize:13 }} />
          ))}
        </div>
        <button onClick={() => { if (!name || !username || !password) return alert('Fill all fields'); onAdd({ name, username, password, role:'staff', active:true }); setName(''); setUsername(''); setPassword('') }}
          style={{ padding:'8px 18px', background:'#C9A84C', color:'#0A0A0A', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>+ Add Staff</button>
      </div>
      <div style={{ fontSize:12, fontWeight:600, color:'#C9A84C', letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>Staff accounts</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:10 }}>
        {staffList.filter(s => s.role === 'staff').map(s => (
          <div key={s.id} style={{ background:'#141414', border:'1px solid #222', borderRadius:10, padding:14, display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'#1C1C1C', border:'1.5px solid #C9A84C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#C9A84C', flexShrink:0 }}>{initials(s.name)}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:'#F5F0E8' }}>{s.name}</div>
              <div style={{ fontSize:11, color:'#8A8070', textTransform:'uppercase', letterSpacing:1, marginTop:2 }}>Staff</div>
              <div style={{ fontSize:11, color:'#6DBF6D', marginTop:3 }}>● Active</div>
            </div>
            <button onClick={() => onRemove(s.id)} style={{ padding:'5px 10px', background:'transparent', border:'1px solid #4A1A1A', borderRadius:6, color:'#E07070', fontSize:11, cursor:'pointer' }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}