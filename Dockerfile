# Usa la imagen base de Nginx
FROM nginx
 
# Copia el archivo de configuración personalizado al contenedor
COPY nginx.conf /etc/nginx/conf.d/
 
# Especificamos dist/*.* para que sólo copie los ficheros que hay en el raíz de dist. Si queremos copiar una carpeta (como la de assets/img/) hay que hacerlo aparte
COPY dist/ /usr/share/nginx/html/
 
# Expone el puerto 80 para que se pueda acceder al servidor web
EXPOSE 8080
 
# Comando para iniciar Nginx cuando se ejecute el contenedor
CMD ["nginx", "-g", "daemon off;"]