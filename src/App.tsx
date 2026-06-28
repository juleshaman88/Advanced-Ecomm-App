import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HomePage from './components/HomePage';
import { hydrateCart } from './redux/cartSlice';
import type { AppDispatch, RootState } from './redux/store';
import './App.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart');

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as typeof cartItems;
        dispatch(hydrateCart(parsedCart));
      } catch {
        sessionStorage.removeItem('cart');
      }
    }
  }, [dispatch]);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  return <HomePage />;
}

export default App;
