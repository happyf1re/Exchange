# Используем официальный образ Node.js в качестве базового
FROM node:16-alpine

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в рабочую директорию
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы в рабочую директорию
COPY . .

# Собираем приложение
RUN npm run build

# Устанавливаем глобально пакет `serve`
RUN npm install -g serve

# Открываем порт 3000
EXPOSE 3000

# Запускаем приложение с использованием `serve`
CMD ["serve", "-s", "build", "-l", "3000"]