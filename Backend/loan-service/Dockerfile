FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY pom.xml .
COPY auth-service/pom.xml auth-service/
COPY account-service/pom.xml account-service/
COPY loan-service/pom.xml loan-service/
COPY api-gateway/pom.xml api-gateway/
COPY discovery-server/pom.xml discovery-server/
RUN apt-get update && apt-get install -y maven && \
    mvn dependency:go-offline -pl loan-service -am || true
COPY . .
RUN mvn clean package -pl loan-service -am -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/loan-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
