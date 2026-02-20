export const AddImgBanner = async (id: number, url: string) => {
  try {
    const response = await fetch(
      `https://${import.meta.env.VITE_SERVER_IP}/api/perfil/${id}/banner`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      },
    );

    const res = response.json();
    console.log("Imagen cargada");
    return res;
  } catch (error) {
    throw new Error("No se pudo cargar la imagen!");
  }
};
