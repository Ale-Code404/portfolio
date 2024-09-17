# For build steps
FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install
COPY . .
# Build the project
RUN npm run build

# Production image
FROM nginx:alpine
# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist /usr/share/nginx/html