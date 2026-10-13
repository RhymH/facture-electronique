import "../mobile.css";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-stage">
      <div className="phone-frame">
        <div className="phone-screen">{children}</div>
      </div>
    </div>
  );
}
