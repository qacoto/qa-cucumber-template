FROM cypress/included:15.15.0

WORKDIR /e2e

COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts=false

COPY . .

CMD ["npm", "run", "cy:run"]
