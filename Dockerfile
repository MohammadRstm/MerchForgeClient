# Build stage - Node never ships in the final image, only the static output it produces.
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Same-origin in production: nginx (this image's own runtime stage) reverse-proxies
# /api/ to the backend container, so the frontend only ever needs a root-relative
# path here -- never a full cross-origin URL like dev's VITE_SERVER_URL_DEV. That
# also means this one built image works behind any domain without a rebuild.
ARG VITE_SERVER_URL_DEV=/
ENV VITE_SERVER_URL_DEV=$VITE_SERVER_URL_DEV
RUN npm run build

# Runtime stage - serves the built static files and proxies /api/ to the backend.
FROM nginx:1.27-alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 127.0.0.1, not localhost: /etc/hosts resolves localhost to ::1 before 127.0.0.1
# here, and nginx only listens on the IPv4 wildcard -- wget would try ::1 first
# and get connection-refused even with nginx up and serving fine on IPv4.
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
