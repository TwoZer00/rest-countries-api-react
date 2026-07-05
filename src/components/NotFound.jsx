import Button from "./Button";

export default function NotFound({ title = "404", message = "Page not found", to = "/", label = "Go home" }) {
  return (
    <div className="flex flex-col items-center justify-center h-full dark:text-white">
      <p className="text-4xl font-bold">{title}</p>
      <p className="text-lg">{message}</p>
      <Button to={to} className="mt-4">{label}</Button>
    </div>
  );
}
