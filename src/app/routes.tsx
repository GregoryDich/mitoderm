import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { Specialists } from "./pages/Specialists";
import { SpecialistDetail } from "./pages/SpecialistDetail";
import { Journal } from "./pages/Journal";
import { ArticleDetail } from "./pages/ArticleDetail";
import { Events } from "./pages/Events";
import { ProductDetail } from "./pages/ProductDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "product/:id", Component: ProductDetail },
      { path: "specialists", Component: Specialists },
      { path: "specialists/:id", Component: SpecialistDetail },
      { path: "journal", Component: Journal },
      { path: "journal/:id", Component: ArticleDetail },
      { path: "events", Component: Events },
      { path: "*", Component: Home },
    ],
  },
]);
