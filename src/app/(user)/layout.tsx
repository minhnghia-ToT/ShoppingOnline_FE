import Header from "@/src/components/Header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Top bar */}
      <div className="topbar">
        Get 15% off on your first order
      </div>

      {/* Header */}
      <Header />

      {/* Main */}
      <main className="main-container">{children}</main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-col">
            <h3>VELORA</h3>
            <p>Modern fashion for Men, Women, and Kids.</p>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <p>Email: support@velora.com</p>
            <p>Phone: +84 123 456 789</p>
          </div>

          <div className="footer-col">
            <h4>Address</h4>
            <p>Ho Chi Minh City</p>
            <p>Vietnam</p>
          </div>

        </div>

        <div className="copyright">
          © 2026 Velora. All rights reserved.
        </div>
      </footer>
    </>
  );
}