"use client";

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

          <div className="footer-col footer-brand">
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

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink:    #0e0e0e;
          --chalk:  #f5f3ef;
          --gold:   #b89a6a;
          --muted:  #888480;
          --border: rgba(14,14,14,0.1);
        }

        body {
          font-family: 'Jost', sans-serif;
          background: var(--chalk);
          color: var(--ink);
        }

        /* ── TOP BAR ── */

        .topbar {
          width: 100%;
          background: var(--ink);
          color: rgba(255,255,255,0.82);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 3px;
          text-transform: uppercase;
          text-align: center;
          padding: 10px 20px;
        }

        /* ── MAIN ── */

        .main-container {
          min-height: calc(100vh - 56px - 36px);
          width: 100%;
        }

        /* ── FOOTER ── */

        .footer {
          background: var(--ink);
          color: rgba(255,255,255,0.65);
          font-family: 'Jost', sans-serif;
          padding: 64px 80px 32px;
        }

        .footer-container {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 28px;
        }

        .footer-brand h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 400;
          color: #fff;
          letter-spacing: 4px;
          margin-bottom: 14px;
        }

        .footer-brand p {
          font-size: 13px;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(255,255,255,0.5);
          max-width: 220px;
        }

        .footer-col h4 {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 18px;
        }

        .footer-col p {
          font-size: 13px;
          font-weight: 300;
          line-height: 2;
          color: rgba(255,255,255,0.55);
        }

        .copyright {
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.3);
          text-align: center;
        }

        /* ── RESPONSIVE ── */

        @media (max-width: 768px) {
          .footer {
            padding: 48px 20px 28px;
          }

          .footer-container {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .footer-brand p {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}