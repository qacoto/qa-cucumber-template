FROM cypress/included:15.15.0

WORKDIR /e2e

# Copiar solo manifestos primero para aprovechar la cache de Docker
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm \
    && pnpm config set --location project --json allowBuilds '{"cypress": true, "esbuild": true}' \
    && pnpm install --frozen-lockfile --ignore-scripts=false

COPY . .

CMD ["pnpm", "run", "cy:run"]
