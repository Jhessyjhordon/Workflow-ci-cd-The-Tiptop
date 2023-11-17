#!/bin/sh

# Démarrer le serveur Node.js en arrière-plan
node /app/server/main.js &

# Démarrer Nginx en premier plan
nginx -g 'daemon off;'
