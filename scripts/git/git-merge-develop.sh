#!/bin/bash

# Script para hacer merge de despliegue-desarrollo a main
git checkout despliegue-desarrollo && \
git fetch origin -p && \
git pull && \
git checkout main && \
git fetch origin -p && \
git pull && \
git reset --hard despliegue-desarrollo && \
git commit --allow-empty -m "Actualización - $(date +%d-%m-%Y)" && \
echo -n "¿Desea realizar un push al main? (s/n): " && \
read response && \
response=$(echo "$response" | tr '[:upper:]' '[:lower:]') && \
case "$response" in
  s) echo "Realizando push al main..." && git push;;
  n) echo "Operación cancelada." ;;
  *) echo "Respuesta no válida. Operación cancelada." ;;
esac
