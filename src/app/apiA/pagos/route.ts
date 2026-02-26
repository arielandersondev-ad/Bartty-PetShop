import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { error } from 'console';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const cita_id = searchParams.get('cita_id');
  const id_cita_pago = searchParams.get('id_cita_pago');

  if (cita_id) {
    const { data, error } = await supabase
      .from('pagos')
      .select('*')
      .eq('cita_id', cita_id)
      .order('created_at', { ascending: false });

    if (error) {return NextResponse.json({ error: error.message }, { status: 500 });}
    return NextResponse.json(data);
  }

  if (id_cita_pago) {
    const { data, error } = await supabase
      .from('pagos_cita_totales')
      .select('*')
      .eq('cita_id', id_cita_pago)
      .single();

    if (error) {return NextResponse.json({ error: error.message }, { status: 500 });}
    return NextResponse.json(data);
  }
  return NextResponse.json({ error: 'Debe enviar cita_id o id_cita_pago' },{ status: 400 });
}


export async function POST(req: Request) {
  const body = await req.json();
  const { cita_id, monto, tipo_pago, tipo_pago_cita } = body;
  if (!cita_id || monto == null || !tipo_pago || !tipo_pago_cita) {return NextResponse.json({ error: 'Campos incompletos' }, { status: 400 });}
  const { data, error } = await supabase
    .from('pagos')
    .insert({ cita_id, monto, tipo_pago, tipo_pago_cita })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, confirmado, monto } = body;
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });
  const updates: { confirmado?: boolean; monto?: number } = {};
  if (confirmado !== undefined) updates.confirmado = confirmado;
  if (monto !== undefined) updates.monto = monto;
  const { data, error } = await supabase
    .from('pagos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE (req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id_pago')
  if (!id){return NextResponse.json({error: 'id_pago requerido'},{status: 400})}
  const {data, error} = await supabase
    .from('pagos')
    .delete()
    .eq('id',id)
    .select()

  if(error) return NextResponse.json({error: error.message},{status:500})
  return NextResponse.json(data)
}