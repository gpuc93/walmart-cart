import { useCart } from "../context/CartContext";
import "../styles/cart.scss";

const Cart = () => {
  const { state, dispatch } = useCart();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const product = JSON.parse(e.dataTransfer.getData("productData"));
  
    if (product) {
      dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
      const allProducts = JSON.parse(localStorage.getItem("allProducts") || "[]");
      const updatedProducts = allProducts.filter((p: any) => p.id !== product.id);
      localStorage.setItem("allProducts", JSON.stringify(updatedProducts));
    } else {
      console.error("Producto no encontrado en la lista global.");
    }
  };
  

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="cart-container" onDrop={handleDrop} onDragOver={handleDragOver}>
        <span className="cart--counter">{state.items.length}</span>
        <span className="cart--icon"><i className="fa-solid fa-cart-shopping"></i></span>
        <p className="cart--label">Arrastra aqui tus productos</p>
      </div>
    </>
  );
};

export default Cart;
