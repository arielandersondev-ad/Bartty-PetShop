import React from "react"

type ConfirmResult = "confirm" | "cancel"

interface ConfirmDialogProps {
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onClose: (result: ConfirmResult) => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirmar acción",
  description = "¿Estás seguro?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onClose,
}) => {
  if (!open) return null

  const handleConfirm = () => onClose("confirm")
  const handleCancel = () => onClose("cancel")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fade-in">
        
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}