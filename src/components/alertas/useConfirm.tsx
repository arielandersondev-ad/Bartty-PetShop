import { useState } from "react"
import { ConfirmDialog } from "./ConfirmDialog"

export function useConfirm() {
  const [open, setOpen] = useState(false)
  const [resolver, setResolver] = useState<(value: boolean) => void>()

  const confirm = () => {
    setOpen(true)
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve)
    })
  }

  const handleClose = (result: "confirm" | "cancel") => {
    setOpen(false)
    resolver?.(result === "confirm")
  }

  const ConfirmComponent = (props: Omit<React.ComponentProps<any>, "open" | "onClose">) => (
    <ConfirmDialog
      {...props}
      open={open}
      onClose={handleClose}
    />
  )

  return { confirm, ConfirmComponent }
}