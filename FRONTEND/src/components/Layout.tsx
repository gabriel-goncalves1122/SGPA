import Navbar from "../components/Navbar";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-content">{children}</main>
    </div>
  );
};

export default Layout;
