# Docker Operations

> Cuándo usarla: construir imágenes Docker, ejecutar tests en contenedores, gestionar el ciclo de vida de los contenedores, copiar artifacts, o debuggear problemas con Docker.

## Archivos relevantes

| Archivo | Propósito |
|---|---|
| `Dockerfile` | Imagen basada en `cypress/included:15.15.0` + Java JRE para Allure |
| `docker-compose.yml` | Define el servicio `app` para ejecución de tests |

## Dockerfile

```dockerfile
FROM cypress/included:15.15.0
ENTRYPOINT []
WORKDIR /e2e
RUN apt-get update && \
    apt-get install -y default-jre && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts=false
COPY . .
CMD ["npm", "run", "cy:run"]
```

- `ENTRYPOINT []` anula el entrypoint por defecto de la imagen base
- Java JRE se instala para soportar Allure commandline
- `npm ci` se ejecuta en build time (no en runtime)
- `--ignore-scripts=false` permite que scripts postinstall se ejecuten

## docker-compose.yml

```yaml
services:
  app:
    build: .
    working_dir: /e2e
    command: ["tail", "-f", "/dev/null"]
    environment:
      - CI=true
```

- `command: ["tail", "-f", "/dev/null"]` mantiene el contenedor vivo para ejecutar comandos contra él

## Ciclo de vida típico

```bash
# Build de la imagen
docker compose build

# Iniciar contenedor en background
docker compose up -d

# Ejecutar tests
docker compose exec app npm run cy:run

# Generar reporte Allure (dentro del contenedor)
docker compose exec app npm run report:allure

# Copiar artifacts al host (si es necesario)
docker compose cp app:/e2e/cypress/reports ./cypress/
docker compose cp app:/e2e/cypress/screenshots ./cypress/
docker compose cp app:/e2e/cypress/videos ./cypress/

# Detener y limpiar
docker compose down --remove-orphans
```

## CI (Jenkins) — pipeline Docker

```groovy
stage('Build image') {
  steps { sh 'docker compose build' }
}
stage('Start Container') {
  steps { sh 'docker compose up -d' }
}
stage('Run Cypress tests') {
  steps {
    script {
      def exitCode = sh(
        script: 'docker compose exec app npm run cy:run',
        returnStatus: true
      )
      currentBuild.result = (exitCode != 0) ? 'UNSTABLE' : 'SUCCESS'
    }
  }
}
stage('Generate Allure report') {
  steps { sh 'docker compose exec app npm run report:allure || true' }
}
```

## Copy de artifacts desde contenedor

En Jenkins se usa `docker cp` directo porque el plugin `docker compose cp` puede no estar disponible:

```groovy
stage('Copy artifacts') {
  steps {
    sh '''
      CONTAINER_ID=$(docker compose ps -q app)
      docker cp $CONTAINER_ID:/e2e/cypress/reports ./cypress/ || true
      docker cp $CONTAINER_ID:/e2e/cypress/screenshots ./cypress/ || true
      docker cp $CONTAINER_ID:/e2e/cypress/videos ./cypress/ || true
    '''
  }
}
```

## Gotchas

- El contenedor se mantiene vivo con `tail -f /dev/null` — no espera a que terminen los tests
- Usar siempre `--remove-orphans` en `docker compose down` para limpiar contenedores huérfanos
- `|| true` en comandos que pueden fallar (report:allure, docker cp) para no romper el pipeline
- La imagen incluye navegadores completos (Electron, Chrome, Edge, Firefox) — ~2GB+ de imagen
- Los tests se ejecutan contra staging externo — asegurar conectividad de red desde el contenedor
- `npm ci` requiere `package-lock.json` — si falta, el build falla
