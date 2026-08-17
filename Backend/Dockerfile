# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY auth-service/pom.xml auth-service/
COPY account-service/pom.xml account-service/
COPY loan-service/pom.xml loan-service/
COPY api-gateway/pom.xml api-gateway/
COPY discovery-server/pom.xml discovery-server/
RUN mvn dependency:go-offline || true
COPY . .
RUN mvn clean package -pl auth-service,account-service,loan-service,api-gateway,discovery-server -am -DskipTests

# Runtime stage for running any service
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/*/target/*.jar /app/jars/
ENTRYPOINT ["sh", "-c", "java -jar /app/jars/${SERVICE_NAME}.jar"]
