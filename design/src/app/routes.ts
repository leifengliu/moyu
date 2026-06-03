import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Menu from "./pages/Menu";
import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Wallet from "./pages/Wallet";
import Points from "./pages/Points";
import Cart from "./pages/Cart";
import OrderDetail from "./pages/OrderDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/menu",
    Component: Menu,
  },
  {
    path: "/product/:id",
    Component: ProductDetail,
  },
  {
    path: "/orders",
    Component: Orders,
  },
  {
    path: "/order/:id",
    Component: OrderDetail,
  },
  {
    path: "/cart",
    Component: Cart,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/wallet",
    Component: Wallet,
  },
  {
    path: "/points",
    Component: Points,
  },
]);