export const AddImgPerfil = async (id: number, url: string) => {
  const response = await fetch(
    `https://${import.meta.env.VITE_SERVER_IP}/api/perfil/${id}/perfil`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ url }),
    },
  );
  const res = await response.json();
  return res;
};
