export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`bg-[#fb5c1d] hover:bg-[#fde848] text-white font-bold py-3 px-8 rounded-full shadow transition-colors text-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 