"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { useMapEvents } from "react-leaflet"

const leafletStyles = `
  .leaflet-container { height: 100%; width: 100%; }
  .leaflet-tile-pane img { max-width: none !important; }
  .leaflet-control-attribution { font-size: 10px; }
  .leaflet-marker-icon, .leaflet-marker-shadow { max-width: none !important; }
`

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false })
const TileLayer    = dynamic(() => import("react-leaflet").then((m) => m.TileLayer),    { ssr: false })
const Marker       = dynamic(() => import("react-leaflet").then((m) => m.Marker),       { ssr: false })


const MapController = dynamic(
  () => import("react-leaflet").then((m) => {
    const { useMap } = m
    return function Controller({ center, onLocate, onError, trigger }: any) {
      const map = useMap()

      // mover mapa cuando cambia centro
      useEffect(() => {
        map.setView(center, 16)
      }, [center])

      // activar geolocalización SOLO cuando cambia trigger
      useEffect(() => {
        if (trigger === 0) return

        map.locate({ setView: true, maxZoom: 16 })

        const onFound = (e: any) => {
          onLocate(e.latlng.lat, e.latlng.lng)
        }

        const onError = () => {
          console.log("No se pudo obtener ubicación")
        }

        map.on("locationfound", onFound)
        map.on("locationerror", onError)

        return () => {
          map.off("locationfound", onFound)
          map.off("locationerror", onError)
        }
      }, [trigger])

      return null
    }
  }),
  { ssr: false }
)

const DEFAULT_CENTER: [number, number] = [-16.50346977922804, -68.1628788751971]

interface LocationPickerProps {
  onConfirm: (lat: number, lng: number) => void
  onClose: () => void
  center?: [number, number]
}

function MapEvents({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onClick(e.latlng.lat, e.latlng.lng) } });
  return null
}

export default function LocationPicker({ onConfirm, onClose, center }: LocationPickerProps) {
  const [position, setPosition]       = useState<[number, number] | null>(null)
  const sucursalCenter: [number, number] = center || DEFAULT_CENTER
  const [mapCenter, setMapCenter]     = useState<[number, number]>(sucursalCenter)
  const [isMounted, setIsMounted]     = useState(false)
  const [geoLoading, setGeoLoading]   = useState(false)
  const [geoError, setGeoError]       = useState<string | null>(null)
  const homePinIcon = useRef<any>(null)
  const userPinIcon = useRef<any>(null)
  const [triggerLocate, setTriggerLocate] = useState(0)
  const [isValid, setIsValid] = useState(false)
  const [messageValid, setMessageValid] = useState('no selecciono una ubicación válida')

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link")
      link.id = "leaflet-css"
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      const style = document.createElement("style")
      style.id = "leaflet-overrides"
      style.textContent = leafletStyles
      document.head.appendChild(style)
    }

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl

      homePinIcon.current = L.divIcon({
        html: `<div style="
          background:#d97706;border:2.5px solid white;border-radius:50% 50% 50% 0;
          width:36px;height:36px;transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;">
          <span style="transform:rotate(45deg);font-size:16px;line-height:1;">📍</span>
        </div>`,
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      })

      userPinIcon.current = L.divIcon({
        html: `<div style="
          background:#16a34a;border:2.5px solid white;border-radius:50% 50% 50% 0;
          width:36px;height:36px;transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;">
          <span style="transform:rotate(45deg);font-size:16px;line-height:1;">🏠</span>
        </div>`,
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      })

      setIsMounted(true)
    })
  }, [])

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Tu dispositivo no soporta geolocalización")
      return
    }

    setGeoLoading(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setPosition(coords)
        setMapCenter(coords)
        setGeoLoading(false)
      },
      (err) => {
        setGeoLoading(false)
        if (err.code === 1) {
          setGeoError("Permiso denegado — seleccioná el punto manualmente en el mapa")
        } else {
          setGeoError("No se pudo obtener la ubicación — intentá de nuevo o seleccioná manualmente")
        }
      },
      { timeout: 8000, maximumAge: 30000, enableHighAccuracy: true }
    )
  }
  async function validateDistance (
    picklat: number,
    picklng: number,
    centerlat: number,
    centerlng: number,
    distanciaMax: number
  ) {
    const res = await fetch('/api/recogida', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        picklat,
        picklng,
        centerlat,
        centerlng,
        distanciaMax,
        action:'validacion',
      }),
    })
    const data = await res.json()
    return data
  }
  const handlerConfirm= async (
    picklat: number,
    picklng: number,
    centerlat: number,
    centerlng: number,
    distanciaMax: number
  ) => {
    const data = await validateDistance(picklat, picklng, centerlat, centerlng, distanciaMax)
    console.log(data.message)
    if(data.habilitado === false){
      setIsValid(data.habilitado)
      setMessageValid(data.message)
    } else {
      setIsValid(true)
      //onConfirm(picklat, picklng)
    }
  }
  const confirmTarget = position ?? sucursalCenter

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-amber-50">
          <div>
            <h2 className="text-xl font-bold text-amber-900">Selecciona tu ubicación</h2>
            <p className="text-sm text-amber-700">
              Usá tu ubicación actual o tocá el mapa para elegir el punto de recojo
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-colors">
            ✕
          </button>
        </div>

        {/* Botón de ubicación actual */}
        <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center gap-3">
          <button
            onClick={() => {setGeoLoading(true);setTriggerLocate(prev => prev + 1)}}
            disabled={geoLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all border ${
              geoLoading
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 active:scale-95"
            }`}
          >
            {geoLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full" />
                Obteniendo ubicación...
              </>
            ) : (
              <>
                <span>📍</span>
                Usar mi ubicación actual
              </>
            )}
          </button>
          {isValid === false && (
            <p className="text-xs text-red-600 flex-1">{messageValid}</p>
          )}

          {/* Error message */}
          {geoError && (
            <p className="text-xs text-red-600 flex-1">{geoError}</p>
          )}

          {/* Confirmación de éxito */}
          {!geoError && position && !geoLoading && (
            <p className="text-xs text-green-600 flex-1 flex items-center gap-1">
              <span>✓</span> Ubicación detectada
            </p>
          )}
        </div>

        {/* Mapa */}
        <div style={{ height: "400px", width: "100%", position: "relative" }}>
          {isMounted && (
            <MapContainer
              center={mapCenter}
              zoom={15}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              <MapController 
                center={mapCenter}
                onLocate={(lat: number, lng: number) => {
                  setPosition([lat, lng])
                  setMapCenter([lat, lng])
                  setGeoLoading(false)
                  setIsValid(false)
                }}
                onError={() => {
                  setGeoLoading(false)
                  setGeoError("No se pudo obtener ubicación — seleccioná manualmente")
                }}
                trigger={triggerLocate}
              />
              <MapEvents onClick={(lat, lng) => {
                setPosition([lat, lng])
                setGeoError(null)
                setIsValid(false)
              }} />

              {position && userPinIcon.current && (
                <Marker position={position} icon={userPinIcon.current} />
              )}
              {homePinIcon.current && (
                <Marker position={sucursalCenter} icon={homePinIcon.current} />
              )}
            </MapContainer>
          )}

          {!isMounted && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <p className="text-gray-500 text-sm">Cargando mapa...</p>
            </div>
          )}

          {/* Hint */}
          {isMounted && !position && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-[400]">
              <div className="bg-white/90 px-4 py-2 rounded-full shadow-md text-amber-900 font-medium border border-amber-200 text-sm whitespace-nowrap">
                👆 Tocá el mapa para marcar el punto exacto
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          {position && (
            <button
              onClick={() => setPosition(null)}
              className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
            >
              Limpiar selección
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              Cancelar
            </button>
            {isValid === false && (
              <button
                type="button"
                onClick={() => {
                  handlerConfirm(confirmTarget[0], confirmTarget[1], sucursalCenter[0], sucursalCenter[1], 2)
                }}
                disabled={!position}
                className={`px-8 py-2 rounded-xl font-bold shadow-lg transition-all ${
                  position
                    ? "bg-amber-600 text-white hover:bg-amber-700 active:scale-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Seleccionar Ubicacion
              </button>
            )}
              <>
              <button 
                type="button"
                onClick={() => {
                  onConfirm(confirmTarget[0], confirmTarget[1])
                  onClose()
                }}
                disabled={!isValid}
                className={`px-8 py-2 rounded-xl font-bold shadow-lg transition-all ${
                  isValid
                    ? "bg-amber-600 text-white hover:bg-green-700 active:scale-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirmar Ubicacion
              </button>
              </>
          </div>
        </div>

      </div>
    </div>
  )
}