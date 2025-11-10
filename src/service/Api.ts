import { Tasa } from "../bdDexie";

export const fetchTasaToque = async (): Promise<Tasa[]> => {
  try {
    const res = await fetch("https://api.eltoque.com/v1/exchange", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2MDEyNTUwMywianRpIjoiMzZhMzIxNWEtN2RkNy00YjYxLTk1MjItMjkyNmY3ZTY1YjZkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjY4ZTkyMTg5MTBkZjBkOGUxMmI3M2U4MiIsIm5iZiI6MTc2MDEyNTUwMywiZXhwIjoxNzkxNjYxNTAzfQ.4dLPOVWbunjw9aJf_B_brzDkKXWQCyA8vENKit3VDLY",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Error al obtener la tasa de cambio");

    const data = await res.json();
    return data; // Dependiendo del API, quizás tengas que hacer data.result o data.tasas
  } catch (error) {
    console.error(error);
    return [];
  }
};
