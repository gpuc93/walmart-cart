import { v4 as uuidv4 } from "uuid";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const fetchProducts = async (keyword: string, page: number): Promise<Product[]> => {
  try {
    const response = await fetch(
      `${API_URL}walmart-search-by-keyword?keyword=${keyword}&page=${page}&sortBy=best_match`,
      {
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": "axesso-walmart-data-service.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) throw new Error("Error en la API");

    const data = await response.json();

    const products: Product[] =
      data.item?.props?.pageProps?.initialData?.searchResult?.itemStacks?.[0]?.items?.map((item: any) => ({
        id: item.id || uuidv4(),
        name: item.name || "Sin nombre",
        price: item.price || 0,
        image: item.image || "https://via.placeholder.com/150",
        description: item.shortDescription || "No description available",
        quantity: 0,
      })) || [];


    const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());

    return uniqueProducts;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};
