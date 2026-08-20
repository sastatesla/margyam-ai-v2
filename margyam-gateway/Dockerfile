FROM node:20-alpine AS base
WORKDIR /app

# Install gateway dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "-r", "dotenv/config", "app.js"]
