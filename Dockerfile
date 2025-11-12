FROM node:alpine AS builder
WORKDIR /app

# Update dependencies
COPY package*.json ./
RUN npm ci

# Port changes to prod
COPY ./ ./

# Build with environment variables (they need to be available at build time)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

FROM nginx:alpine AS prod

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

# Run the server
CMD ["nginx", "-g", "daemon off;"]
