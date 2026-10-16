const API_URL = "https://api.jolpi.ca/ergast/f1/drivers.json?limit=40";

export async function obtenerPilotos(){
    const respuesta = await fetch(API_URL);
    if(!respuesta.ok){
        throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
    }

    const datos = await respuesta.json();

    const pilotos = datos.MRData?.DriverTable?.Drivers ?? [];
    return pilotos
}