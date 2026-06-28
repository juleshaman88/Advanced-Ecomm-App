import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import Categories from './Categories';
import Products from './Products';
import ProductDetail from './ProductDetail';
import NavBar from './NavBar';
import type { CartItem, Product } from '../redux/cartSlice';
import { useDispatch } from 'react-redux';
import { clearCart, removeFromCart } from '../redux/cartSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [view, setView] = useState<'home' | 'cart'>('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const handleCheckout = () => {
    dispatch(clearCart());
    sessionStorage.removeItem('cart');
    setCheckoutMessage('Checkout complete. Your cart is empty.');
  };

  const handleNavigate = (nextView: 'home' | 'cart') => {
    setView(nextView);
    setSelectedProduct(null);
    if (nextView !== 'cart') {
      setCheckoutMessage('');
    }
  };

  return (
    <div className="app-shell">
      <NavBar onNavigate={handleNavigate} />
      {selectedProduct ? (
        <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />
      ) : view === 'home' ? (
        <main className="home-view">
          <header className="hero-section">
            <h1>The FakeStore App</h1>
            <p>Browse all of our great products to find something you love.</p>
            <Categories selectedCategory={selectedCategory} onChange={setSelectedCategory} />
          </header>
          <Products selectedCategory={selectedCategory} onSelectProduct={setSelectedProduct} />
        </main>
      ) : (
        <main className="cart-view">
          <h2>Your Cart</h2>
          {checkoutMessage ? <p className="checkout-success">{checkoutMessage}</p> : null}
          <p>Total items: {totalItems}</p>
          <p>Total price: ${totalPrice.toFixed(2)}</p>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="cart-list">
              {cartItems.map((item: CartItem) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.title} onError={(event) => {
                    event.currentTarget.src = 'https://via.placeholder.com/120x120?text=No+Image';
                  }} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button type="button" onClick={() => dispatch(removeFromCart(item.id))}>
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}
          <button type="button" className="checkout-button" onClick={handleCheckout} disabled={cartItems.length === 0}>
            Checkout
          </button>
        </main>
      )}
    </div>
  );
}
