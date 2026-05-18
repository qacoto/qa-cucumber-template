# QA Cypress Cucumber Template 

Plantilla base para proyectos de automatización E2E utilizando **Cypress**, **Cucumber (BDD)** y **Allure Reports**, con integración continua configurada para **Jenkins** y ejecución en **Docker**.

## Tecnologías

- [Cypress](https://www.cypress.io/) - Framework E2E (v15.x)
- [Cucumber](https://cucumber.io/) - Behavior Driven Development (BDD)
- [Allure Report](https://docs.qameta.io/allure/) - Generación de reportes visuales interactivos
- [Docker](https://www.docker.com/) - Containerización
- [Jenkins](https://www.jenkins.io/) - Pipeline CI/CD

## Uso Local (Recomendado para Desarrollo)

Para escribir y depurar pruebas localmente, es recomendable usar tu entorno nativo.

### Requisitos
- [Node.js](https://nodejs.org/) (v18+)
- Java (JRE 8+) - *Requerido únicamente para generar y visualizar el reporte Allure de forma local*

### Instalación

```bash
npm install
```

### Comandos Principales

- **Abrir Cypress (Modo Interactivo):**
  ```bash
  npm run cy:open
  ```
- **Correr pruebas en consola:**
  ```bash
  npm run cy:run
  ```
- **Correr pruebas + Generar Reporte Allure:**
  ```bash
  npm run cy:run:report
  ```
- **Limpiar reportes y capturas anteriores:**
  ```bash
  npm run clean
  ```

## Uso con Docker

Si preferís no instalar dependencias locales o querés simular exactamente el entorno de CI, podés usar Docker. La imagen ya incluye Cypress, Node.js y Java preconfigurados.

1. **Construir la imagen:**
   ```bash
   docker compose build
   ```

2. **Levantar el contenedor en segundo plano:**
   ```bash
   docker compose up -d
   ```

3. **Ejecutar las pruebas dentro del contenedor:**
   ```bash
   docker compose exec app npm run cy:run
   ```

4. **Generar reporte Allure (dentro del contenedor):**
   ```bash
   docker compose exec app npm run report:allure
   ```

5. **Detener y limpiar el entorno Docker:**
   ```bash
   docker compose down
   ```

## Integración Continua (Jenkins)

El proyecto incluye un `Jenkinsfile` completamente configurado. El pipeline realiza lo siguiente:

1. Construye la imagen de Docker.
2. Levanta el contenedor como un servicio aislado.
3. Corre todas las pruebas automatizadas.
4. Extrae los artefactos (reportes, videos y capturas de pantalla) en Jenkins workspace.
5. Limpia y destruye el contenedor.
6. Utiliza **Allure Jenkins Plugin** para generar y publicar un dashboard visual en la interfaz de Jenkins.
7. Archiva las capturas de pantalla y videos de los tests fallidos en los *Artifacts* del build para fácil descarga.

> **Importante para CI:** Para que el pipeline finalice con éxito, asegurate de tener instalado el plugin **Allure Jenkins Plugin** en tu servidor Jenkins y de haber configurado en `Manage Jenkins > Tools` una instalación de "Allure Commandline" nombrada exactamente como `allure`.
