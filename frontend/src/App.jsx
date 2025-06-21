import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { AdminPage } from './pages/admin'
import { LoginPage, SignupPage } from './pages/auth'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import useUserStore from './stores/useUserStore'
import { useEffect } from 'react'
import LoadingSpinner from './components/LoadingSpinner'
import CategoryPage from './pages/CategoryPage'
import { useCartStore } from './stores/useCartStore'
import CartPage from './pages/CartPage'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage'
import PurchaseCancelPage from './pages/PurchaseCancelPage'

function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { user, checkingAuth, checkAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!checkingAuth && !user && pathname !== "/login") navigate("/login")
  }, [user, checkingAuth]);

  useEffect(() => {
    if (user) getCartItems();
  }, [user, getCartItems]);

  if (checkingAuth) {
    return <LoadingSpinner />
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      {/* Background gradient */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
        </div>
      </div>
      <div className='relative z-50 pt-20'>
        {user && <Navbar />}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/secret-dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />} />
          <Route path='/category/:categoryId' element={<CategoryPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/purchase-success' element={<PurchaseSuccessPage />} />
          <Route path='/purchase-cancel' element={< PurchaseCancelPage />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  )
}

export default App
