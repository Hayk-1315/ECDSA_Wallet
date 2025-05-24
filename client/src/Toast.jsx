function Toast({ message, type = "success", onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg text-white animate-fade-in-down transition-opacity duration-300
      ${type === "error" ? "bg-red-600" : "bg-green-600"}`}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? "✅" : "❌"} {message}
        <button onClick={onClose} className="ml-4 text-white text-sm">✖</button>
      </div>
    </div>
  );
}

export default Toast;