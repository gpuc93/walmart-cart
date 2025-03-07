import './App.css'
import { CartProvider } from './context/CartContext'
import Cart from './components/Cart'
import Home from './pages/Home'
import Header from './components/Header'

function App() {

  return (
    <CartProvider>
      <Header/>
      <Cart/>
      <Home/>
    </CartProvider>
  )
}

export default App
