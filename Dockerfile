
# Используем базовый образ Amazon Corretto 17
FROM amazoncorretto:17 as build

# Устанавливаем необходимые инструменты для скачивания и распаковки Maven
RUN yum update -y && yum install -y curl tar gzip

# Скачиваем и распаковываем Maven из надежного источника
RUN curl -L https://archive.apache.org/dist/maven/maven-3/3.8.4/binaries/apache-maven-3.8.4-bin.tar.gz | tar -xz -C /usr/local/

# Создаем символическую ссылку для Maven, чтобы можно было использовать mvn из командной строки
RUN ln -s /usr/local/apache-maven-3.8.4 /usr/local/maven

# Устанавливаем переменные окружения для Maven
ENV MAVEN_HOME=/usr/local/maven
ENV PATH=${MAVEN_HOME}/bin:${PATH}

# Проверяем версию Maven
RUN mvn -version

# Копируем исходный код проекта в контейнер и собираем приложение
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Начинаем новую стадию сборки для минимизации размера конечного образа
FROM amazoncorretto:17

# Копируем только собранный артефакт из предыдущей стадии
COPY --from=build /app/target/*.jar app.jar

# Определяем точку входа для запуска приложения
ENTRYPOINT ["java","-jar","app.jar"]