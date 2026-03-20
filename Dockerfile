# Use Node.js as base
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:stable-alpine

# Use environment variable for PORT, default to 8080
ENV PORT=8080

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE ${PORT}

# Nginx alpine image has a built-in feature to process templates in /etc/nginx/templates/*.template 
# and output them to /etc/nginx/conf.d/*.conf using envsubst.
CMD ["nginx", "-g", "daemon off;"]
