import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import type { Product } from '../redux/cartSlice';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const dispatch = useDispatch();

  return (
    <main className="product-detail-view">
      <button type="button" className="back-button" onClick={onBack}>
        ← Back to products
      </button>
      <article className="product-detail">
        <img
          src={product.image}
          alt={product.title}
          onError={(event) => {
            event.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
        <section className="product-info">
          <h2>{product.title}</h2>
          <p className="category">{product.category}</p>
          <p className="rating">⭐ {product.rating?.rate ?? 'N/A'} ({product.rating?.count ?? 0} reviews)</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>
          <button
            type="button"
            className="add-to-cart-btn"
            onClick={() => {
              dispatch(addToCart(product));
            }}
          >
            Add to cart
          </button>
        </section>
      </article>
    </main>
  );
}
