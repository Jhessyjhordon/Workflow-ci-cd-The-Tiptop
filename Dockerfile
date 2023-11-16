# Étape 1: Construire l'application Angular pour SSR et Browser
FROM node:latest AS builder

WORKDIR /var/jenkins_home/workspace/front-multibranches-pipeline_dev/angular
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:ssr  # Construire pour SSR

# Étape 2: Préparer les fichiers pour le serveur Node.js et Nginx
FROM node:latest as prepare

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /var/jenkins_home/workspace/front-multibranches-pipeline_dev/angular/dist/the-tiptop-front/server /app/server
COPY --from=builder /var/jenkins_home/workspace/front-multibranches-pipeline_dev/angular/dist/the-tiptop-front/browser /app/browser

# Étape 3: Configurer l'Image Finale avec Nginx et le Serveur Node.js
FROM nginx:alpine

# Installer Node.js
RUN apk add --no-cache nodejs

# Copier les fichiers du serveur Node.js et du client Angular
COPY --from=prepare /app/server /app/server
COPY --from=prepare /app/browser /usr/share/nginx/html

# Copier la configuration Nginx et le script de démarrage
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80 4000
CMD ["/start.sh"]
