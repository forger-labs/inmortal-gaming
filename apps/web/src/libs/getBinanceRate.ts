import axios from "axios";

interface DolarApiRes {
  fuente: string;
  nombre: string;
  compra: number;
  venta: number;
  promedio: number;
  fechaActualizacion: string;
}

export async function getBinanceRate() {
  const url = "https://ve.dolarapi.com/v1/dolares/paralelo";

  try {
    const { data } = await axios.get<DolarApiRes>(url);

    if (data.promedio > 0) {
      return data.promedio;
    } else {
      console.log("⚠️ No se encontraron anuncios disponibles.");
    }
  } catch (error) {
    console.error("❌ Error al conectar con la API de Binance:", error);
  }
}
