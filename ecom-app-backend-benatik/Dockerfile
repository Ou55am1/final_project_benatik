# Multi-module builder for Spring Boot services
ARG SERVICE
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /workspace

# Copy pom and modules for incremental build
COPY pom.xml ./
COPY config-service/pom.xml config-service/
COPY discovery-service/pom.xml discovery-service/
COPY gateway-service/pom.xml gateway-service/
COPY customer-service/pom.xml customer-service/
COPY inventory-service/pom.xml inventory-service/
COPY billing-service/pom.xml billing-service/
COPY supplier-service/pom.xml supplier-service/
COPY analytics-service/pom.xml analytics-service/

# Copy sources
COPY config-service/src config-service/src
COPY discovery-service/src discovery-service/src
COPY gateway-service/src gateway-service/src
COPY customer-service/src customer-service/src
COPY inventory-service/src inventory-service/src
COPY billing-service/src billing-service/src
COPY supplier-service/src supplier-service/src
COPY analytics-service/src analytics-service/src

# Package the selected service
RUN mvn -pl ${SERVICE} -am package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
ARG SERVICE
COPY --from=builder /workspace/${SERVICE}/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
