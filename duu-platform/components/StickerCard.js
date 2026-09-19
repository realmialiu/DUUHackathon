export default function StickerCard({ children, tilt = '', tape = false, pin = false, className = '' }) {
  return (
    <div className={`sticker-card p-5 ${tilt} ${className}`}>
      {tape && <div className="tape" />}
      {pin && <div className="pin" />}
      {children}
    </div>
  );
}
