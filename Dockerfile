# Utiliser une image de base Node.js
FROM node:latest

# Définir le répertoire de travail dans le conteneur
WORKDIR /var/jenkins_home/workspace/workflow-test-pipeline/angular


# Copier le fichier package.json et package-lock.json (si disponible) dans le conteneur
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier le reste du code de l'application dans le conteneur
COPY . .

# Exposer le port sur lequel votre application écoute
EXPOSE 4200

# Définir la commande pour démarrer votre application
CMD ["npm", "start"]
