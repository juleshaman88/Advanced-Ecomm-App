import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import type { Product } from '../redux/cartSlice';

interface ProductsProps {
  selectedCategory: string;
  onSelectProduct: (product: Product) => void;
}

export default function Products({ selectedCategory, onSelectProduct }: ProductsProps) {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      const endpoint = selectedCategory && selectedCategory !== 'all'
        ? `https://fakestoreapi.com/products/category/${selectedCategory}`
        : 'https://fakestoreapi.com/products';
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json() as Promise<Product[]>;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Unable to load products right now.</p>;
  }

  return (
    <div className="products-grid">
      {data?.map((product) => (
        <article className="product-card" key={product.id}>
          <img
            src={product.image}
            alt={product.title}
            onError={(event) => {
              event.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
          <h3>{product.title}</h3>
          <p className="rating">⭐ {product.rating?.rate ?? 'N/A'}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <div className="product-card-buttons">
            <button type="button" onClick={() => onSelectProduct(product)}>
              View Details
            </button>
            <button type="button" onClick={() => dispatch(addToCart(product))} className="add-to-cart-quick">
              Add to cart
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
