

export const Escenarios = async () => {

    const rest = await fetch(`https://${import.meta.env.VITE_SERVER_IP}/api/escenario`)
    const data = await rest.json();
    return data;

}

