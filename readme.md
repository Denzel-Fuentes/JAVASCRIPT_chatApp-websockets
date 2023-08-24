# UNICHAT
Unichat es una aplicacion de mensajeria simple y sencilla que permite enviar mensajes a travez de websockets , ademas de mantener un registro de los mensajes enviados
## Dependencias
Para comenzar a preparar el proyecto primero se debe de ejecutar el siguiente comando, que instalara todos los paquetes que se usaran  en el proyecto
```cmd
npm install
```
## Base de datos
#### Redis
Es necesario de igual forma mencionar que se debe de tener instalado y configurado redis en la maquina donde se ejecutara el proyecto, ya que esta se utilizara para almacenar la sesion del usuario
#### MongoDB
Se debe de tener instalado y configurado mongodb ya que en esta base de datos se guardaran los mensajes de los chats ademas de informacion del usuario
## Comenzar
Para empezar a ejecutar el programa debera de ejecutar el siguiente comando
```cmd
npm run dev
```