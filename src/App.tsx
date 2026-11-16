
import { useLocation } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/layouts/Footer";

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <AppRoutes />

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
