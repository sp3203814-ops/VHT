import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import FindTutor from "./pages/FindTutor";
import BecomeTutor from "./pages/BecomeTutor";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

import AdminDashboard from "./pages/AdminDashboard"; // ye add karo

export default function App() {
  return (
    <>
      <Navbar />
      <LoginModal />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-tutor" element={<FindTutor />} />
        <Route path="/become-tutor" element={<BecomeTutor />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Route */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
      </Routes>

      <Footer />
    </>
  );
}