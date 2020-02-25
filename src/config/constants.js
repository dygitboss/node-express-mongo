export const METHODS = {
  GET: 'get',
  PATCH: 'patch',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

export const errorStatusCodes = {
  InvalidInputError: 400,
  WrongOwnershipError: 403,
  ValidationError: 400,
};

export const ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMINISTRATOR: 'administrator',
};
