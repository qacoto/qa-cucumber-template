FROM cypress/included:15.15.0

ENTRYPOINT []

WORKDIR /e2e

# Install Java, required by Allure command line
RUN apt-get update && \
    apt-get install -y default-jre && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts=false

COPY . .

CMD ["npm", "run", "cy:run"]
