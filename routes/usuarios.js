const express = require('express'); //FRAMEWORCK
const ruta = express.Router();
const Joi = require('@hapi/joi'); //MODULO DE VALIDACION

const usuarios = [
  {id:1, nombre:'Pablo'},
  {id:2, nombre:'Roberto'},
  {id:3, nombre:'Jose'},
  {id:4, nombre:'Miguel'},
];

ruta.get('/', (req, res) => {
  res.send(usuarios);
});

ruta.get('/:id', (req, res) => {
  let usuario = usuarios.find(user => user.id === parseInt(req.params.id));
  if(!usuario) res.status(404).send('El Usuario Solicitado No Existe!');
  res.send(usuario);
});

/*ruta.get('/api/usuarios/:val1/:val2', (req, res) => {
  res.send(req.params);
});*/

ruta.post('/', (req, res) => {
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

ruta.put('/:id', (req, res) => {
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

ruta.delete('/:id', (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if(!usuario){
    res.status(404).send('El Usuario Solicitado No Existe!')
    return;
  }

  const index = usuarios.indexOf(usuario);
  usuarios.splice(index, 1);
  res.send(usuarios);
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

module.exports = ruta;
