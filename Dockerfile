FROM cypress/included:15.15.0

WORKDIR /e2e

# Copiar solo manifestos primero para aprovechar la cache de Docker
COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts=false

COPY . .

CMD ["npm", "run", "cy:run"]
