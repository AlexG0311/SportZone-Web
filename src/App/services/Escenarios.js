

export const Escenarios = async () => {

    const rest = await fetch("http://192.168.100.147:4000/api/escenario")
    const data = await rest.json();
    return data;

}

