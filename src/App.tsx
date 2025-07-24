import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PasteForm from "./components/PasteForm";
import PasteView from "./components/PasteView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PasteForm />} />
        <Route path="/view/:slug" element={<PasteView />} />
      </Routes>
    </Router>
  );
}

export default App;
