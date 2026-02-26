import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET (req: Request) {
  const { searchParams } = new URL(req.url);
  const cita_id = searchParams.get("cita_id");
  if (!cita_id) {
    return NextResponse.json({ error: "cita_id requerido" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("servicio_cita")
    .select("*")
    .eq("cita_id", cita_id)
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST (req: Request) {
  const body = await req.json();
  const { servicio, valor, usuario_id, cita_id } = body;
  if (!servicio || valor == null || !usuario_id) {
    return NextResponse.json({ error: 'Campos incompletos' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('servicio_cita')
    .insert({ servicio, valor, usuario_id, cita_id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE (req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {return NextResponse.json({ error: "ID requerido" }, { status: 400 });}
  const { data, error } = await supabase
    .from("servicio_cita")
    .delete()
    .eq("id", id)
    .select()

  if (error) {return NextResponse.json({ error: error.message }, { status: 500 });}
  return NextResponse.json(data);
}