FROM node:alpine
WORKDIR /app

# Update dependencies
COPY package*.json ./
RUN npm install

# Port changes to containers
COPY ./ ./

# Expose vite's default port
EXPOSE 5173

# Initialize the server
CMD ["npm", "run", "dev"]