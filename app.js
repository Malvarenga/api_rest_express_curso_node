const express = require('express'); //FRAMEWORCK
const config = require('config');
const logger = require('./logger'); //FRAMEWORCK
const Joi = require('@hapi/joi'); //MODULO DE VALIDACION
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000; //VARIABLE DE ENTORNO INICIALIZADA export PORT=5000
const usuarios = [
  {id:1, nombre:'Pablo'},
  {id:2, nombre:'Roberto'},
  {id:3, nombre:'Jose'},
  {id:4, nombre:'Miguel'},
];

app.use(express.static('website')); //COMPARTIR ARCHIVOS ESTATICOS
app.use(express.static('recursos'));

app.use(express.json()); //MIDDLEWARE INDICAMOS QUE DEBE SETEAR A JSON CUALQUIER REQUEST VIA JSON
app.use(express.urlencoded({extended:true})); //MIDDLEWARE INDICAMOS QUE DEBE SETEAR A JSON CUALQUIER REQUEST VIA FORMULARIO

//CONFIGURACION DE ENTORNOS
console.log('Aplicacion: ' + config.get('nombre'));
console.log('DB Server: ' + config.get('configDB.host'));

app.use(logger); //MIDDLEWARE PERSONALIZADO SE EJECUTA ANTES QUE LOS ROUTES

//USO DE MIDDLEWARE DE TERCERO
app.use(morgan('tiny')); //LOGS PARA PETICIONES HTTP

app.get('/', (req, res) => {
  res.send('Hola Mundo desde Express');
});

app.get('/api/usuarios', (req, res) => {
  res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
  let usuario = usuarios.find(user => user.id === parseInt(req.params.id));
  if(!usuario) res.status(404).send('El Usuario Solicitado No Existe!');
  res.send(usuario);
});

/*app.get('/api/usuarios/:val1/:val2', (req, res) => {
  res.send(req.params);
});*/

app.post('/api/usuarios', (req, res) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required()
  });
  const {error, value} = schema.validate({nombre: req.body.nombre});

  if(!error){
    const usuario = {
      id: usuarios.length + 1,
      nombre: req.body.nombre
    };
    usuarios.push(usuario);
    res.send(usuario);
  }else {
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
  }

});

app.put('/api/usuarios/:id', (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if(!usuario){
    res.status(404).send('El Usuario Solicitado No Existe!')
    return;
  }

  const {error, value} = validarUsuario(req.body.nombre);

  if(error){
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
    return;
  }

  usuario.nombre = value.nombre;
  res.send(usuario);

});

app.delete('/api/usuarios/:id', (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if(!usuario){
    res.status(404).send('El Usuario Solicitado No Existe!')
    return;
  }

  const index = usuarios.indexOf(usuario);
  usuarios.splice(index, 1);
  res.send(usuarios);
});

app.listen(port, () => {
  console.log(`Servidor Escuchando por el Puerto ${port}...`);
});

function existeUsuario(id) {
  return usuarios.find(user => user.id === parseInt(id));
}

function validarUsuario(name) {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required()
  });
  return schema.validate({nombre: name});
}
