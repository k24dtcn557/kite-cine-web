# Stage 1: Install dependencies
FROM node:24-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build the React app
FROM node:24-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG REACT_APP_API_URL
ARG REACT_APP_APP_ENV
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_APP_ENV=$REACT_APP_APP_ENV

RUN npm run build

# Stage 3: Serve with Node using 'serve'
FROM node:24-alpine AS runner

RUN npm install -g serve

WORKDIR /app

# Copy only the built static files
COPY --from=builder /app/build ./build

EXPOSE 3000

ENV PORT=3000

# Serve the React build on port 3000, with SPA fallback for React Router
CMD ["serve", "-s", "build", "-l", "3000"]
