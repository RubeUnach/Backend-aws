const { Usuario } = require('../infrastructure/database/models');

const PUBLIC_ATTRIBUTES = [
  'id',
  'username',
  'email',
  'role',
  'active',
  'createdAt',
  'updatedAt'
];


async function findById(id) {
  return Usuario.findByPk(id, {
    attributes: PUBLIC_ATTRIBUTES
  });
}


async function findByUsername(username) {
  return Usuario.findOne({
    where: {
      username
    }
  });
}


async function findByEmail(email) {
  return Usuario.findOne({
    where: {
      email
    },
    attributes: PUBLIC_ATTRIBUTES
  });
}


async function findAll() {
  return Usuario.findAll({
    attributes: PUBLIC_ATTRIBUTES,
    order: [
      ['id', 'ASC']
    ]
  });
}


async function create({
  username,
  email,
  passwordHash,
  role = 'user'
}) {
  const usuario = await Usuario.create({
    username,
    email,
    passwordHash,
    role
  });

  return findById(usuario.id);
}


async function update(id, data) {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    return null;
  }

  const allowedFields = [
    'username',
    'email',
    'role'
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      usuario[field] = data[field];
    }
  }

  await usuario.save();

  return findById(id);
}

async function setActive(id, active) {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    return null;
  }

  usuario.active = active;

  await usuario.save();

  return findById(id);
}


module.exports = {
  findById,
  findByUsername,
  findByEmail,
  findAll,
  create,
  update,
  setActive
};