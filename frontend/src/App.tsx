import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Divination from "@/pages/Divination";
import DivinationResult from "@/pages/DivinationResult";
import ResultPage from "@/pages/ResultPage";
import Profile from "@/pages/Profile";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import BaguaPage from "@/pages/BaguaPage";
import AnimationDemo from "@/pages/AnimationDemo";
import "./App.css";

function AppContent() {
  return (
    <Routes>
      {/* 八卦图页面 - 不使用Layout组件 */}
      <Route path="/bagua" element={<BaguaPage />} />

      {/* 其他页面使用Layout组件 */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/divination" element={<Divination />} />
              <Route
                path="/divination/result"
                element={<DivinationResult />}
              />
              <Route
                path="/divination/result-page"
                element={<ResultPage />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/animation-demo" element={<AnimationDemo />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;