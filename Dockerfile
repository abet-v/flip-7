# Stage 1: build Flip 7 (root project)
FROM node:20-alpine AS build-vire7
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: build Saber Inclusivo (sub-project)
FROM node:20-alpine AS build-saber
WORKDIR /app
COPY saber-inclusivo/package*.json ./
RUN npm install --no-audit --no-fund
COPY saber-inclusivo/ .
RUN npm run build

# Stage 3: single nginx serving both SPAs
FROM nginx:alpine
COPY --from=build-vire7 /app/dist /usr/share/nginx/html
COPY --from=build-saber /app/dist /usr/share/nginx/html/saber-inclusivo
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
