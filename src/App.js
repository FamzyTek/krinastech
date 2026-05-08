import LoginScreen from './LoginScreen'
import AdminDashboard from './AdminDashboard'
import StaffDashboard from './StaffDashboard'

import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function App() {
  const [role, setRole] = useState(null)
  const [currentUser, setCurrentUser] = useState('')
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [staffList, setStaffList] = useState([])
  const [page, setPage] = useState('overview')
  const [cart, setCart] = useState([])

  useEffect(() => {
    if (role) { loadProducts(); loadSales(); loadStaff() }
  }, [role])

  async function loadProducts() {
    const { data } = await supabase.from('products').select('*').order('id')
    if (data) setProducts(data)
  }
  async function loadSales() {
    const { data } = await supabase.from('sales').select('*').order('created_at', { ascending: false })
    if (data) setSales(data)
  }
  async function loadStaff() {
    const { data } = await supabase.from('staff').select('*').order('id')
    if (data) setStaffList(data)
  }
  async function doLogin(username, password) {
    const { data } = await supabase.from('staff').select('*').eq('username', username).eq('password', password).single()
    if (data) { setRole(data.role); setCurrentUser(data.name) }
    else alert('Invalid credentials')
  }
  async function recordSale(cartItems) {
    try {
      const total = cartItems.reduce((a, c) => a + c.sell * c.qty, 0)
      const profit = cartItems.reduce((a, c) => a + (c.sell - c.cost) * c.qty, 0)
      const items = cartItems.map(c => ({ name: c.name, qty: c.qty, price: c.sell * c.qty }))
      const staff = currentUser.split(' ')[0]
      const today = new Date().toISOString().split('T')[0]

      const { error: saleError } = await supabase
        .from('sales')
        .insert({ staff, items, total, profit, date: today })

      if (saleError) {
        console.error('Sale error:', saleError)
        alert('Error saving sale: ' + saleError.message)
        return
      }

      for (const item of cartItems) {
        await supabase
          .from('products')
          .update({ qty: item.qty_remaining })
          .eq('id', item.id)
      }

      await loadProducts()
      await loadSales()

    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Something went wrong: ' + err.message)
    }
  }
  async function deleteSale(id) {
    await supabase.from('sales').delete().eq('id', id); loadSales()
  }
  async function updateSale(id, updates) {
    await supabase.from('sales').update(updates).eq('id', id); loadSales()
  }
  async function addProduct(prod) {
    await supabase.from('products').insert(prod); loadProducts()
  }
  async function updateProduct(id, updates) {
    await supabase.from('products').update(updates).eq('id', id); loadProducts()
  }
  async function deleteProduct(id) {
    await supabase.from('products').delete().eq('id', id); loadProducts()
  }
  async function addStaffMember(member) {
    await supabase.from('staff').insert(member); loadStaff()
  }
  async function removeStaff(id) {
    await supabase.from('staff').delete().eq('id', id); loadStaff()
  }

  if (!role) return <LoginScreen onLogin={doLogin} />
  if (role === 'admin') return (
    <AdminDashboard
      currentUser={currentUser} products={products} sales={sales} staffList={staffList}
      page={page} setPage={setPage}
      onDeleteSale={deleteSale} onUpdateSale={updateSale}
      onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct}
      onAddStaff={addStaffMember} onRemoveStaff={removeStaff}
      onLogout={() => { setRole(null); setCurrentUser(''); setPage('overview') }}
    />
  )
  return (
    <StaffDashboard
      currentUser={currentUser} products={products} sales={sales}
      page={page} setPage={setPage} cart={cart} setCart={setCart}
      onRecordSale={recordSale}
      onLogout={() => { setRole(null); setCurrentUser(''); setPage('pos') }}
    />
  )
}