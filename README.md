# cucumber-template

## Instalación de Docker

1. Descarga Docker Desktop para Windows en:

   ```text
   https://www.docker.com/products/docker-desktop/
   ```

2. Instala Docker Desktop siguiendo el asistente.

3. Abre Docker Desktop y asegúrate de que el demonio esté corriendo.

4. Verifica en terminal:

   ```bash
   docker version
   docker compose version
   ```

## Usar con Docker

Este proyecto usa `pnpm` como gestor de dependencias, por lo que el contenedor instala y ejecuta los scripts con `pnpm`.

1. Construir la imagen:

```bash
docker compose build
```

2. Ejecutar los tests de Cypress:

```bash
docker compose up --abort-on-container-exit
```

3. Si prefieres ejecutar solo el servicio una vez y eliminar el contenedor al salir:

```bash
docker compose run --rm app
```

> La imagen usa `cypress/browsers:node18.20.0-chrome120-ff125` para tener Chrome y dependencias de Cypress disponibles.
