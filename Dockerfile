FROM node:alpine AS builder
WORKDIR /app

# Update dependencies
COPY package*.json ./
RUN npm ci

# Port changes to prod
COPY ./ ./
RUN npm run build

FROM nginx:alpine AS prod

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

# Run the server
CMD ["nginx", "-g", "daemon off;"]