import { Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar.jsx";
import EntriesPage from "./pages/EntriesPage.jsx";
import NewEntryPage from "./pages/NewEntryPage.jsx";
import GraphsPage from "./pages/GraphsPage.jsx";

export default function App() {
  return (
    <div className="app">
      <TopBar />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<EntriesPage />} />
          <Route path="/new" element={<NewEntryPage />} />
          <Route path="/graphs" element={<GraphsPage />} />
        </Routes>
      </main>
    </div>
  );
}
