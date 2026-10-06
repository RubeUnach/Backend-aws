const usuarioService = require('../services/usuario.service');
const auditService = require('../services/audit.service');
const { getRequestContext } = require('../utils/request.util');

async function create(req, res, next) {
  try {
    const usuario = await usuarioService.createUser(req.validatedBody);
    const context = getRequestContext(req);

    await auditService.record({
      usuarioId: req.auth.userId,
      action: 'USER_CREATED',
      resource: `/api/usuarios/${usuario.id}`,
      httpMethod: context.httpMethod,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      status: 'SUCCESS',
      details: {
        targetUserId: usuario.id,
        targetUsername: usuario.username,
        role: usuario.role
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: usuario
    });

  } catch (error) {
    next(error);
  }
}

async function findAll(req, res, next) {
  try {
    const usuarios = await usuarioService.getAllUsers();

    return res.status(200).json({success: true, data: usuarios});
  } catch (error) {
    next(error);
  }
}

async function findById(req, res, next) {
  try {
    const usuario = await usuarioService.getUserById(req.validatedId);

    return res.status(200).json({success: true, data: usuario});
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {

    const usuario = await usuarioService.updateUser(req.validatedId, req.validatedBody);
    const context = getRequestContext(req);

    await auditService.record({
      usuarioId: req.auth.userId,
      action: 'USER_UPDATED',
      resource: `/api/usuarios/${usuario.id}`,
      httpMethod: context.httpMethod,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      status: 'SUCCESS',
      details: {
        targetUserId: usuario.id,
        targetUsername: usuario.username
      }
    });  


    return res.status(200).json({
      success: true,
      message:'Usuario actualizado correctamente',
      data: usuario
    });

  } catch (error) {
    next(error);
  }
}


async function setStatus(req, res, next) {
  try {
    const usuario = await usuarioService.setUserActive(req.validatedId, req.validatedBody.active);
    const context = getRequestContext(req);


    await auditService.record({
      usuarioId: req.auth.userId,
      action: 'USER_STATUS_CHANGED',
      resource: `/api/usuarios/${usuario.id}/status`,
      httpMethod: context.httpMethod,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      status: 'SUCCESS',
      details: {
        targetUserId: usuario.id,
        targetUsername: usuario.username,
        active: usuario.active
      }
    });

    return res.status(200).json({
      success: true,
      message: req.validatedBody.active ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente',
      data: usuario
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  setStatus
};