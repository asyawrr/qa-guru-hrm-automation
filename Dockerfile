FROM mcr.microsoft.com/playwright:v1.58.0-noble

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Default: run all tests; override with docker run ... npm run test:ui etc.
CMD ["npm", "run", "test"]
