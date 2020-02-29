import Joi from '@hapi/joi';
import { notFound } from '@hapi/boom';

import models from '../../models';
import { METHODS, ROLES } from '../../config/constants';
import { assert } from '../../helpers';

const { User } = models;

export const getUsers = {
  method: METHODS.GET,
  path: '/users',
  // validate middleware supports both functional and object schemas
  validate: {
    query: {
      skip: Joi.number().integer().min(0).default(0),
      limit: Joi.number().integer().min(1).default(10),
    },
  },
  async handler(req, res) {
    const { count, rows } = await User.findAndCountAll({ skip: req.query.skip, limit: req.query.limit });
    res.json({ data: rows, total: count });
  },
};

export const getUser = {
  method: METHODS.GET,
  path: '/users/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
  },
  async handler(req, res) {
    const user = await User.findByPk(req.params.id);
    assert(user, notFound, 'User not found');
    res.json({ data: user });
  },
};

export const createUser = {
  method: METHODS.POST,
  path: '/users',
  validate: {
    body: {
      first_name: Joi.string(),
      last_name: Joi.string(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().required(),
    },
  },
  async handler(req, res) {
    const user = await User.create(req.body);
    res.json({ data: await User.findByPk(user.id) });
  },
};

export const updateUser = {
  method: METHODS.PATCH,
  path: '/users/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
    body: {
      first_name: Joi.string(),
      last_name: Joi.string(),
      email: Joi.string().email({ minDomainSegments: 2 }),
      role: Joi.string().valid(...Object.values(ROLES)),
    },
  },
  async handler(req, res) {
    const user = await User.findByPk(req.params.id);
    assert(user, notFound, 'User not found');
    Object.keys(req.body).forEach((param) => {
      user[param] = req.body[param];
      user.markModified(param);
    });
    await user.save();
    res.json({ data: user });
  },
};

export const updateOrCreateUser = {
  method: METHODS.PUT,
  path: '/users/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
    body: {
      first_name: Joi.string(),
      last_name: Joi.string(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      role: Joi.string().valid(...Object.values(ROLES)),
    },
  },
  async handler(req, res) {
    const [user, created] = await User.findOrCreate({
      where: { id: req.params.id }, defaults: req.body,
    });
    res.json({ data: user || created });
  },
};

export const deleteUser = {
  method: METHODS.DELETE,
  path: '/users/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
  },
  async handler(req, res) {
    const user = await User.findByPk(req.params.id);
    assert(user, notFound, 'User not found');
    await user.destroy();
    res.json({ data: user });
  },
};
