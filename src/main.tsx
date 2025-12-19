
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { initializeMockData } from "./utils/mockData";

  // Initialize mock data
  initializeMockData();

  createRoot(document.getElementById("root")!).render(<App />);
  