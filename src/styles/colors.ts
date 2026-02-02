// Paleta de colores inspirada en el logo Bartty
export const colors = {
  // Colores principales
  primary: '#8B4513',      // Marrón café (como el pelo del perro)
  secondary: '#D2691E',    // Naranja oscuro (acento cálido)
  accent: '#FF8C00',       // Naranja brillante (destalles)
  
  // Colores neutros
  dark: '#3E2723',         // Marrón muy oscuro
  light: '#FFF8E1',        // Crema claro
  white: '#FFFFFF',        // Blanco puro
  
  // Colores de estado
  success: '#4CAF50',      // Verde
  warning: '#FF9800',      // Naranja
  error: '#F44336',        // Rojo
  info: '#2196F3',         // Azul
  
  // Gradientes
  gradient: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
  gradientLight: 'linear-gradient(135deg, #D2691E 0%, #FF8C00 100%)',
  
  // Sombras
  shadow: '0 4px 6px rgba(139, 69, 19, 0.1)',
  shadowHover: '0 8px 12px rgba(139, 69, 19, 0.2)',
};

// Clases CSS personalizadas
export const customStyles = {
  button: {
    primary: 'bg-[#8B4513] hover:bg-[#6B3410] text-white',
    secondary: 'bg-[#D2691E] hover:bg-[#B8591A] text-white',
    accent: 'bg-[#FF8C00] hover:bg-[#E67E00] text-white',
    outline: 'border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white',
  },
  card: {
    base: 'bg-white border border-[#D2691E] shadow-[0_4px_6px_rgba(139,69,19,0.1)]',
    hover: 'hover:shadow-[0_8px_12px_rgba(139,69,19,0.2)]',
  },
  input: {
    base: 'border border-[#D2691E] focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513] focus:ring-opacity-20',
  },
  text: {
    primary: 'text-[#8B4513]',
    secondary: 'text-[#D2691E]',
    accent: 'text-[#FF8C00]',
    light: 'text-[#FFF8E1]',
  },
  background: {
    primary: 'bg-[#8B4513]',
    secondary: 'bg-[#D2691E]',
    accent: 'bg-[#FF8C00]',
    light: 'bg-[#FFF8E1]',
    gradient: 'bg-gradient-to-r from-[#8B4513] to-[#D2691E]',
  }
};