# Vite inlines VITE_* variables at build time, not runtime, so the API origin
# has to be supplied as a build arg rather than a container environment
# variable - a single image is therefore built per target API origin. See
# .env.production.example for what this value should look like.
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_SERVER_URL_DEV
ENV VITE_SERVER_URL_DEV=$VITE_SERVER_URL_DEV
RUN npm run build

# ---- runtime image: static files behind nginx ----
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
