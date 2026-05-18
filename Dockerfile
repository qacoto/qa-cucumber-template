FROM cypress/included:15.15.0

WORKDIR /e2e

# Copiar solo manifestos primero para aprovechar la cache de Docker
COPY package.json package-lock.json ./

RUN apt-get update \
    && apt-get install -y --no-install-recommends openjdk-21-jre-headless \
    && rm -rf /var/lib/apt/lists/* \
    && npm ci --ignore-scripts=false

COPY . .

ENTRYPOINT []
CMD ["npm", "run", "cy:run"]
