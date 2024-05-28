# Stage 1: Build the application with Maven
FROM maven:3.8.3-openjdk-17 AS maven_build
WORKDIR /app
COPY pom.xml .
COPY src src
RUN mvn package -DskipTests

# Stage 2: Create the Docker image
FROM openjdk:17-jdk-slim
COPY --from=maven_build /app/target/*.jar /app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
