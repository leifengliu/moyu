import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Menu from "./pages/Menu";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Wallet from "./pages/Wallet";
import Points from "./pages/Points";
import Cart from "./pages/Cart";
import OrderDetail from "./pages/OrderDetail";
import Coupons from "./pages/Coupons";
import Benefits from "./pages/Benefits";
import Support from "./pages/Support";
import Membership from "./pages/Membership";
import UserInfo from "./pages/UserInfo";

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
    path: "/shop",
    Component: Shop,
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
  {
    path: "/coupons",
    Component: Coupons,
  },
  {
    path: "/benefits",
    Component: Benefits,
  },
  {
    path: "/support",
    Component: Support,
  },
  {
    path: "/membership",
    Component: Membership,
  },
  {
    path: "/user-info",
    Component: UserInfo,
  },
]);