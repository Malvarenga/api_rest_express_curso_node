const debug = require('debug')('app:inicio');
const express = require('express'); //FRAMEWORCK
const config = require('config');
const usuarios = require('./routes/usuarios');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000; //VARIABLE DE ENTORNO INICIALIZADA export PORT=5000

app.use(express.static('website')); //COMPARTIR ARCHIVOS ESTATICOS
app.use(express.static('recursos'));

app.use(express.json()); //MIDDLEWARE INDICAMOS QUE DEBE SETEAR A JSON CUALQUIER REQUEST VIA JSON
app.use(express.urlencoded({extended:true})); //MIDDLEWARE INDICAMOS QUE DEBE SETEAR A JSON CUALQUIER REQUEST VIA FORMULARIO
app.use('/api/usuarios', usuarios);
//CONFIGURACION DE ENTORNOS
console.log('Aplicacion: ' + config.get('nombre'));
console.log('DB Server: ' + config.get('configDB.host'));

//USO DE MIDDLEWARE DE TERCERO
if (app.get('env') === 'development') {
  app.use(morgan('tiny')); //LOGS PARA PETICIONES HTTP
  debug('Morgan esta Habilitado.');
}

app.get('/', (req, res) => {
  res.send('Hola Mundo desde Express');
});

app.listen(port, () => {
  console.log(`Servidor Escuchando por el Puerto ${port}...`);
});
