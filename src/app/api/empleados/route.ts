import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(req: Request){
  try {
    const { searchParams } = new URL(req.url)
    const rol = searchParams.get("rol")
  
    if(!rol){return NextResponse.json({message: 'es necesario el rol del empleado'},{status: 400})}
  
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('rol',rol)
      .eq('activo',true)

    if(error){return NextResponse.json({error: error.message},{status: 500})}

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({message: 'error en el servidor',error},{status: 500})
  }
}