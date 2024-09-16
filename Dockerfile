FROM nginx:alpine
# Set the html folder as build output
COPY dist /usr/share/nginx/html