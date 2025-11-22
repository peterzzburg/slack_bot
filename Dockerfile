# Stage 1: Dependencies
FROM node:18-alpine AS builder

WORKDIR /app


COPY package*.json ./
RUN npm install --omit=dev


FROM node:22-alpine

WORKDIR /app

# stage 2: runner
COPY --from=builder /app/node_modules ./node_modules


COPY . .


ENV PORT=3009
ENV NODE_ENV=production


EXPOSE 3009


CMD ["npm", "start"]
