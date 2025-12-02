// components/Layout.tsx
import Navbar from "./Navbar";
import "./Layout.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout">
      <Navbar /> {/* ✅ A Navbar é renderizada aqui */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
