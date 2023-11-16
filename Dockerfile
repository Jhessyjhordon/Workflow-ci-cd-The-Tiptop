# Étape 1: Construire l'application Angular pour SSR et Browser
FROM node:latest AS builder

WORKDIR /var/jenkins_home/workspace/front-multibranches-pipeline_dev/angular
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:ssr  # Assurez-vous avoir une commande de build pour SSR

# Étape 2: Configurer le serveur Node.js pour SSR
FROM node:latest as server

WORKDIR /app
COPY --from=builder /var/jenkins_home/workspace/front-multibranches-pipeline_dev/angular/dist/the-tiptop-front/server /app
# Exposer un port pour le SSR (par exemple, 4000)
EXPOSE 4000
CMD ["node", "main.js"]

# Étape 3: Configurer le serveur Nginx pour les fichiers statiques et comme reverse proxy
FROM nginx:alpine as nginx

COPY --from=builder /var/jenkins_home/workspace/front-multibranches-pipeline_dev/angular/dist/the-tiptop-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# Exposer le port 80 pour Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
