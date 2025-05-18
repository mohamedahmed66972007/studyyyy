import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import Material Design Icons font
const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
document.head.appendChild(linkElement);

// Import Google Fonts: Noto Sans Arabic
const fontLinkElement = document.createElement("link");
fontLinkElement.rel = "stylesheet";
fontLinkElement.href = "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap";
document.head.appendChild(fontLinkElement);

// Set page title
document.title = "منصة المواد الدراسية";

createRoot(document.getElementById("root")!).render(<App />);
