import { useEffect, useState, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import { fetchProducts, Product } from "../services/api";
import { useCart } from "../context/CartContext";

import "../styles/home.scss"

const Home = () => {
  const { state, dispatch } = useCart();
  const [searchTerm, setSearchTerm] = useState("computer");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const loadProducts = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const newProducts = await fetchProducts(searchTerm, page);
      
      if (newProducts.length === 0) {
        setHasMore(false);
        return;
      }

      setAllProducts((prev) => {
        const updatedProducts = [...prev, ...newProducts];
        return Array.from(new Map(updatedProducts.map(p => [p.id, p])).values());
      });

    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, hasMore, loading]);

  useEffect(() => {
    loadProducts();
  }, [searchTerm, page]);

  useEffect(() => {
    setProducts(allProducts.filter(
      (product) => !state.items.some((cartItem) => cartItem.id === product.id)
    ));
  }, [state.items, allProducts]);


  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);


  const handleResetApp = async () => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("cart");

    setSearchTerm("computer");
    setPage(1);
    setHasMore(true);
    setAllProducts([]);
    setProducts([]);
    await loadProducts();
  };

  return (
    <div className="home--container">
      <button onClick={handleResetApp} className="reset-button">🔄 Reiniciar Aplicación</button>
      <div className="search--content">
  <input
    className="input-search"
    type="text"
    placeholder="Buscar productos..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setPage(1);
      setHasMore(true);
      setAllProducts([]);
      setProducts([]);
    }}
  />
  <span className="search--icon">
    <i className="fa-solid fa-magnifying-glass"></i>
  </span>
</div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {loading && <p>Cargando más productos...</p>}
    </div>
  );
};

export default Home;
