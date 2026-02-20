export const GetImgBannerPerfilUser = async (id: number) => {
  const response = await fetch(
    `https://${import.meta.env.VITE_SERVER_IP}/api/perfil/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const Banner = await response.json();
  return { Banner };
};
