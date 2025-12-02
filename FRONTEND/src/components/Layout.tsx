// components/Layout.tsx
import Navbar from "./Navbar";
import "./Layout.css"; // se tiver

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
