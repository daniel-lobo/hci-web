Instalación de la página web
============================

Pasos a seguir:
_______________

Copiar el contenido del directorio **app** en la raiz. Es importante destacar que lo que se necesitan son los siguientes items:

- Carpeta *assets*
- Carpeta *js*
- Carpeta *public*
- Carpeta *views*
- Archivo *index.html*

Importante:
_______________

La página solo funcionara si los archivos se acceden mediante el protocolo *http://*.

La misma no responderá a *file://* y por lo tanto no puede ser corrida localmente. En el caso que se requiera, recomendamos instalar
**serb** (*SimpleHTTPServer*) a traves de **npm** (*Node Package Manager*). El puerto default es el *8000* por lo tanto se debería
acceder a *http://localhost:8000* para correr la página localmente.
