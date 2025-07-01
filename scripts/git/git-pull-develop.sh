#!/bin/bash

git pull --rebase origin despliegue-desarrollo && \
echo -n '¿Desea realizar un push forzado? (s/n): ' && \
read response && \
response=$(echo "$response" | tr '[:upper:]' '[:lower:]') && \
case "$response" in
    s) echo 'Realizando push forzado...' && git push --force ;;
    n) echo 'Operación cancelada.' ;;
    *) echo 'Respuesta no válida. Operación cancelada.' ;;
esac
