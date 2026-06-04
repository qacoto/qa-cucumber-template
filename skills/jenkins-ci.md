# Jenkins CI/CD

> Cuándo usarla: configurar o modificar el pipeline Jenkins, debuggear builds fallidos, publicar reportes Allure en Jenkins, archivar artifacts, o entender el flujo de CI.

## Pipeline overview

El pipeline se define en `Jenkinsfile` en la raíz del proyecto. Utiliza `docker compose` para ejecutar tests dentro de contenedores.

## Stages del pipeline

| Stage | Descripción |
|---|---|
| **Checkout** | Clonar el repositorio (SCM checkout) |
| **Build image** | `docker compose build` — construir imagen Docker |
| **Clean reports** | Limpiar artifacts de runs anteriores |
| **Start Container** | `docker compose up -d` — levantar contenedor |
| **Run Cypress tests** | `docker compose exec app npm run cy:run` — ejecutar tests |
| **Generate Allure report** | `docker compose exec app npm run report:allure` — generar reporte |
| **Copy artifacts** | Copiar reports, screenshots y videos desde el contenedor al host |
| **Publish Allure report** | Publicar reporte Allure via Jenkins Allure Plugin |
| **Archive artifacts** | Archivar reports, screenshots y videos en Jenkins |

## Manejo de errores

El pipeline está configurado como **UNSTABLE** (no FAILURE) cuando los tests fallan:

```groovy
script {
  def exitCode = sh(
    script: 'docker compose exec app npm run cy:run',
    returnStatus: true
  )
  currentBuild.result = (exitCode != 0) ? 'UNSTABLE' : 'SUCCESS'
}
```

Esto permite que los stages posteriores (Allure report, archive) se ejecuten incluso si hay fallos.

## Post-build (siempre)

```groovy
post {
  always {
    sh 'docker compose down --remove-orphans || true'
  }
}
```

El contenedor siempre se detiene y limpia, independientemente del resultado.

## Allure Jenkins Plugin

Configuración requerida en el pipeline:

```groovy
stage('Publish Allure report') {
  steps {
    allure([
      includeProperties: false,
      jdk: '',
      properties: [],
      reportBuildPolicy: 'ALWAYS',
      results: [[path: 'cypress/reports/allure-results']],
      commandline: 'allure'
    ])
  }
}
```

### Prerrequisitos en Jenkins

1. **Allure Jenkins Plugin** instalado en Jenkins
2. **Herramienta Allure** configurada en **Manage Jenkins → Tools**, con nombre `allure`
3. La herramienta `allure` debe estar referenciada como `commandline: 'allure'` en el pipeline

## Copy de artifacts desde Docker

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

`|| true` evita que el stage falle si los directorios no existen o están vacíos.

## Archive de artifacts

```groovy
stage('Archive artifacts') {
  steps {
    archiveArtifacts(
      artifacts: 'cypress/reports/**',
      fingerprint: true,
      allowEmptyArchive: true
    )
    archiveArtifacts(
      artifacts: 'cypress/screenshots/**',
      fingerprint: true,
      allowEmptyArchive: true
    )
    archiveArtifacts(
      artifacts: 'cypress/videos/**',
      fingerprint: true,
      allowEmptyArchive: true
    )
  }
}
```

- `allowEmptyArchive: true` permite que el stage continúe si no hay artifacts
- `fingerprint: true` para tracking de artifacts

## Configuración del proyecto

- `COMPOSE_PROJECT_NAME = 'qa-cucumber-template'` (environment variable)
- `ansiColor('xterm')` para logs con color en la consola de Jenkins
- El pipeline usa `agent any` (no restringido a nodos específicos)

## Gotchas

- El build se marca como **UNSTABLE** no FAILURE para que stages posteriores se ejecuten
- Docker compose requiere que Jenkins tenga acceso a Docker (socket docker)
- Los artifacts copiados desde Docker pueden tener permisos de root — verificar el usuario del agente Jenkins
- Allure plugin debe estar instalado y configurado ANTES de que el pipeline intente usarlo
- Los paths en `docker cp` son relativos al contenedor (`/e2e/cypress/...`)
- `archiveArtifacts` comprime y almacena en Jenkins — monitorear el espacio en disco
