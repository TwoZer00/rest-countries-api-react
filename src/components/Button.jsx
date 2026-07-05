import { Link } from "react-router-dom";

export default function Button({ to, onClick, children, className = "", ...props }) {
  const base = `border rounded py-2 px-4 hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${className}`;
  if (to) return <Link to={to} className={base} {...props}>{children}</Link>;
  return <button onClick={onClick} className={base} {...props}>{children}</button>;
}
