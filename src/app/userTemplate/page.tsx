
export default function UserTemplate() {
  return (
    <div className="flex flex-col md:flex-row gap-3 h-full md:h-[100vh] w-[100vw] md:w-1/4 bg-amber-100">
      <div>datos del usuario</div>
      <div className="flex flex-col md:flex-row gap-3">
        <div>panel de nueva cita</div>
        <div>lista de citas</div>
      </div>
    </div>
  )
}
