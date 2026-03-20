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
# Copy template to a staging location
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

EXPOSE ${PORT}

# Explicitly substitute the PORT variable and start Nginx.
# This ensures it works on Cloud Run even if the default entrypoint scripts are bypassed.
CMD sh -c "envsubst '\\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
