import "./App.css";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
    return (
        <>
        <ScrollToTop/>
            <Navbar />
            <AppRoutes />
            <Footer />
        </>
    );
}