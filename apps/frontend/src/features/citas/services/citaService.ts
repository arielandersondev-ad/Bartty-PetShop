export const getCitas = async () => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  const response = await fetch(`${BACKEND_URL}/api/citas`);
  if (!response.ok) {
    throw new Error('Error al obtener citas del backend separado');
  }
  return response.json();
};
