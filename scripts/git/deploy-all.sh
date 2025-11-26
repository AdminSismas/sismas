echo "Antes de comenzar a desplegar a los ambientes";
echo "¿Ya haz realizado el merge con la rama despliegue-desarrollo? (y/n)";
read answer;
while [[ "$answer" != "Y" && "$answer" != "y" && "$answer" != "N" && "$answer" != "n" ]]; do
    echo "Por favor, responde con 'y' o 'n'";
    read answer;
done

if [ "$answer" == "n" -o "$answer" == "N" ]
then
  echo "Por favor, realiza el merge con la rama despliegue-desarrollo"
else
  echo "Comenzando el despliegue a los ambientes";
  # gh workflow run "Deploy to Manizales" &&\
  # gh workflow run "Deploy to Masora" &&\
  # gh workflow run "Deploy to Montenegro" &&\
  # gh workflow run "Deploy to Quimbaya" &&\
  # gh workflow run "Deploy to Barrancabermeja" &&\
  # gh workflow run "Deploy to Filandia"
fi
