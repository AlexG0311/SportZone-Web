

export const Escenarios = async () => {

    const rest = await fetch("https://backend-sportzone-production.up.railway.app/api/escenario")
    const data = await rest.json();
    return data;

}

