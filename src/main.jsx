import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Rank from "./pages/Rank";
import Honor from "./pages/Honor";
import Store from "./pages/Store";
import Dictionary from "./pages/Dictionary/index.jsx";
import Game from "./pages/Game/index.jsx";
import AtomRenderer from "./components/Renderer";

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "game",
        Component: Game,
      },
      {
        path: "dictionary",
        Component: Dictionary,
      },
      {
        path: "honor",
        Component: Honor,
      },
      {
        path: "rank",
        Component: Rank,
      },
      {
        path: "store",
        Component: Store,
      },
      {
        path: "test/renderer",
        Component: AtomRenderer,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
