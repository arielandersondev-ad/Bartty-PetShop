interface WhatsAppButtonProps {
  phone: string;
  message: string;
}

export function WhatsAppButton({ phone, message }: WhatsAppButtonProps) {

  const handleClick = () => {
    const cleanPhone = phone.replace(/\D/g, ""); // elimina + espacios etc
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex justify-center align-middle items-center">
      <button
        onClick={handleClick}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >📩
      </button>
    </div>
  );
}
