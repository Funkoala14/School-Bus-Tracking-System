// import "amfe-flexible/index.js";
import { createRoot } from "react-dom/client";
import "../tailwind.css";
import RouterView from "./router/index";
import "./index.css"

createRoot(document.getElementById("root")).render(<RouterView />);
