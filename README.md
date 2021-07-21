# Node-API-REST
Aplicación Node para la creación de un API REST

* Git > 2.3
    git config --global user.name "Tu nombre"
    git config --global user.email "Tu correo"

* Node versión estable (14.17.+)
* * Paquetes
* * * Nodemon (Instalar en una terminal con permisos de administrador en windows o anteponiendo sudo en linux o mac)
        npm install -g nodemon
        npm unistall -g nodemon      (Para desinstalar)

        nodemon app.js      Para ejecutar un archivo y este pendiente de los cambios sin tener que volverlo a ejecutar

# Descargar y reconstruir las dependencias para usar el proyecto
> npm install

# Trabajar con git desde VSCode
> git init
> git checkout -- .                     Volver a dejar el proyecto en su última versión del repositorio
> git add .                             Preparar archivos para commit
> git commit -m "Mensaje del commit"    Realizar Commit

# Trabajar con Heroku
> git branch                                    Para saber el nombre de la rama
> git push heroku main                          Publicar cambios a heroku (main/master)

* * Establecer variables de entorno en heroku
> heroku config                                 Para ver las variables de entorno configuradas
> heroku config:set nombre_variable="valor"     Para establecer una nueva variable de entorno
> heroku config:unset nombre_variable           Para quitar una variable de entorno existente
> heroku config:set MONGO_CNN="[URL DE CONEXIÓN A MONGODB]"     Configurar la conexión a MongoBD en las variables de entorno a Heroku

* * Ver logs en Servidor desplegado (Producción)
> heroku logs -n 100                            Para ver los últimos 100 logs
> heroku logs -n 100 --tail                     Para dejar en consola los logs en vivo, para estarlos monitoreando

# Inicio de proyecto
> npm init -y
    El archivo package.json se crea con configuraciones default, pero para subir a servidor se requiere configurar la propiedad "scripts": {"start": "node app.js"}, con lo cual podemos ejecutar el comando npm start para levantar la aplicación

> npm install express dotenv cors
    Crear el archivo .env en la raiz del proyecto con el siguiente 
    Este archivo solo servirá para pruebas locales, ya que se está ignorando para subir al repositorio y por ende al servidor

    Contenido:
        PORT=8080
        MONGODB_CNN=[URL DE CONEXIÓN A MONGODB]
        SECRET_OR_PRIVATE_KEY=[CLAVE_SUPER_SECRETA_PARA_JWT]

    Para el servidor se crea otro archivo .dev.env con el contenido:
        PORT=8080
        MONGO_CNN=
        SECRET_OR_PRIVATE_KEY=

> Crear el archivo app.js y el model server.js, que será el punto de entrada de la aplicación y el lugar donde estarán definida la configuración del servidor
> Crear el directorio routes donde manejaremos las rutas de la aplicación
> Crear el directorio controllers donde se manejará la lógica de lo que haremos en cada ruta
