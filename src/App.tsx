import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { ServicePage } from "./pages/ServicePage";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Services />} />
        <Route path="/ti" element={<ServicePage slug="ti" />} />
        <Route path="/manutencao" element={<ServicePage slug="manutencao" />} />
        <Route path="/financas" element={<ServicePage slug="financas" />} />
        <Route path="/contabilidade" element={<ServicePage slug="contabilidade" />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
