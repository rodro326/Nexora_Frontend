import Navbar from "./components/layouts/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/layouts/Footer";

function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;