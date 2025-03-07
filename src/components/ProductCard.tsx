import { useCart } from "../context/CartContext";
import "../styles/product.scss";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("productData", JSON.stringify(product));
  };

  return (
    <div className="product-card" draggable onDragStart={handleDragStart}>
      <img src={product.image} alt={product.name} />
      <div className="product-card--divider"></div>
      <h3 className="product-card--name">{product.name}</h3>
      <p className="product-card--price">${product.price}</p>

      <button className="add-product--btn" onClick={handleAddToCart}>Agregar a tu compra</button>
    </div>
  );
};

export default ProductCard;
