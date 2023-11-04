# Utiliser une image de base Node.js
FROM node:latest AS builder

WORKDIR /var/jenkins_home/workspace/front-multibranches-pipeline_dev/angular

COPY package*.json ./
RUN npm install
COPY . .
RUN ./node_modules/.bin/ng build --configuration development

# Serve stage: Utiliser une image Nginx pour servir l'application
FROM nginx:alpine

# Copier le build Angular à partir de l'étape de builder
COPY --from=builder /var/jenkins_home/workspace/front-multibranches-pipeline_dev/angular/dist/ /usr/share/nginx/html

# Utiliser votre configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
