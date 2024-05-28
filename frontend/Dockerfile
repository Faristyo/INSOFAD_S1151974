FROM node:latest as builder
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY .  .
RUN npm run build --prod
FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/bol-com-webshop/browser /usr/share/nginx/html