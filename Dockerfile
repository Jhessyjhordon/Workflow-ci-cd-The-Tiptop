# Étape 1: Construire l'application Angular pour SSR et Browser
FROM node:latest AS builder

WORKDIR /var/jenkins_home/workspace/front-multibranches-pipeline_dev/angular
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:ssr  # Assurez-vous d'avoir une commande de build pour SSR

# Étape 2: Configurer le serveur Node.js pour SSR
FROM node:latest as server

COPY --from=builder /var/jenkins_home/workspace/front-multibranches-pipeline_dev/angular/dist/the-tiptop-front/server /app
CMD ["node", "/app/main.js"]

# Étape 3: Configurer le serveur Nginx pour les fichiers statiques
FROM nginx:alpine as nginx

COPY --from=builder /var/jenkins_home/workspace/front-multibranches-pipeline_dev/angular/dist/the-tiptop-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
