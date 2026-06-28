import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

interface NavBarProps {
  onNavigate: (view: 'home' | 'cart') => void;
}

export default function NavBar({ onNavigate }: NavBarProps) {
  const cartCount = useSelector((state: RootState) => state.cart.items.reduce((total, item) => total + item.quantity, 0));

  return (
    <nav className="navbar">
      <button type="button" onClick={() => onNavigate('home')}>
        Home
      </button>
      <button type="button" onClick={() => onNavigate('cart')}>
        Cart ({cartCount})
      </button>
    </nav>
  );
}
