FROM nexus-registry-proxy-resource-manager.apps.msa31.do.neoflex.ru/nginx:latest
WORKDIR /usr/share/nginx/html
COPY build/ ./