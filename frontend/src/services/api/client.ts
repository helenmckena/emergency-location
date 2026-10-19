import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
});

// Перехватываем запросы и возвращаем успешную заглушку с фейковыми данными
apiClient.interceptors.request.use(async (config) => {
  console.log(`[Mock Mode] Запрос перехвачен: ${config.url}`);
  
  throw {
    response: {
      status: 200,
      data: {
        id: 1, // <--- Убирает ошибку #undefined и подставляет номер заявки
        success: true,
        message: 'Успешный ответ от мок-сервера',
        location: { 
          lat: 43.238949, 
          lng: 76.889709 
        },
      },
    },
  };
});

// Превращаем «ошибку» от перехватчика в нормальный успешный ответ Axios
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 200) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);