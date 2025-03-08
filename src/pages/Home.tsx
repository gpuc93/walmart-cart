import { useEffect, useState, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import { fetchProducts, Product } from "../services/api";
import { useCart } from "../context/CartContext";
import debounce from "lodash/debounce";
import "../styles/home.scss";

const Home = () => {
  const { state, dispatch } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = useCallback(
    async (search: string, currentPage: number) => {
      if (!hasMore || loading) return;
      setLoading(true);
      try {
        const newProducts = await fetchProducts(search, currentPage);
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
    },
    [hasMore, loading]
  );

  useEffect(() => {
    setProducts(
      allProducts.filter(
        (product) => !state.items.some((cartItem) => cartItem.id === product.id)
      )
    );
  }, [state.items, allProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  useEffect(() => {
    loadProducts(searchTerm, page);
  }, [page]);

  const handleResetApp = (resetCart: boolean, newSearch?: string) => {
    if (resetCart) {
      dispatch({ type: "CLEAR_CART" });
      localStorage.removeItem("cart");
    }

    const search = newSearch !== undefined ? newSearch : searchTerm;
    setSearchTerm(search);
    setPage(1);
    setHasMore(true);
    setAllProducts([]);
    setProducts([]);
    loadProducts(search, 1);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      handleResetApp(false, value);
    }, 500),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="home--container">
      <button onClick={() => handleResetApp(true)} className="reset-button">
      <i className="fa-solid fa-rotate-right"></i> Reiniciar Aplicación
      </button>
      <div className="search--content">
        <input
          className="input-search"
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleChange}
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
