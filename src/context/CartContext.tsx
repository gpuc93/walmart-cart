import { createContext, useReducer, ReactNode, useContext, useEffect } from "react";
import { Product } from "../services/api";

interface CartState {
  items: Product[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "INCREASE_QUANTITY"; payload: string }
  | { type: "DECREASE_QUANTITY"; payload: string }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]")
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let updatedState;
  switch (action.type) {
    case "ADD_TO_CART":
      const existingProduct = state.items.find(item => item.id === action.payload.id);
      if (existingProduct) {
        updatedState = {
          items: state.items.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      } else {
        updatedState = { items: [...state.items, { ...action.payload, quantity: 1 }] };
      }
      break;

    case "INCREASE_QUANTITY":
      updatedState = {
        items: state.items.map(item =>
          item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
      break;

    case "DECREASE_QUANTITY":
      updatedState = {
        items: state.items
          .map(item =>
            item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter(item => item.quantity > 0) 
      };
      break;

    case "REMOVE_FROM_CART":
      updatedState = { items: state.items.filter(item => item.id !== action.payload) };
      break;

    case "CLEAR_CART":
      updatedState = { items: [] };
      break;

    default:
      return state;
  }

  localStorage.setItem("cart", JSON.stringify(updatedState.items));
  return updatedState;
};

const CartContext = createContext<
  { state: CartState; dispatch: React.Dispatch<CartAction> } | undefined
>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};
