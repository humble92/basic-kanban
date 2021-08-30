import { Router } from 'express';
import { Events } from '../constants';
import { UserNotFound } from '../error';
import { catchAsync } from '../middleware/error';
import { idPathValidation, requestBodyValidate } from '../middleware/requestValidation';
import EventManager from '../utils/eventManager';
import { postUserSchema } from '../validationSchemas/user';

const router = Router();

/* router.get('/:id', idPathValidation, async (req, res) => {
  try {
    const result = await getUserById(req.params.id);
    res.ok(result);
  } catch(error) {
    //next(error)
    next(new Error(error))
  }
}); */

router.get(
  '/:id',
  idPathValidation,
  catchAsync(async (req, res) => {
    res.ok(await getUserById(req.params.id));
  })
);

router.get('/student', (req, res) => {
  res.ok('student');
});

router.post(
  '/',
  requestBodyValidate(postUserSchema),
  catchAsync(async (req, res) => {
    // now we can say for sure at least name will be in the request body
    res.created(await createUser(req.body.name, req.body.permissionIds));
  })
);

// without catchAsync
router.patch('/:id', idPathValidation, requestBodyValidate(postUserSchema), async (req, res, next) => {
  res.created(await updateUser(req.params.id, req.body.name, req.body.permissionIds, next));
});

// with catchAsync
router.patch(
  '/v2/:id',
  idPathValidation,
  requestBodyValidate(postUserSchema),
  catchAsync(async (req, res) => {
    res.created(await updateUserV2(req.params.id, req.body.name, req.body.permissionIds));
  })
);

export default router;

// Business logic

const getUserById = async id => {
  return await searchUserFromDB(id);
};

const createUser = async (name, permissionIds) => {
  EventManager.getInstance().emit(Events.NEW_TASK_ASSIGNED, name);

  return await insertUserIntoDB(name, permissionIds);
};

const updateUser = async (id, name, permissionIds, next) => {
  const user = await searchUserFromDB(id);

  if(!user) {
    next(new UserNotFound(id));
  }

  try {
    return await updateUserInDB(id, name, permissionIds);
  } catch (error) {
    //next(error)
    next(new Error(error));
  }
};

const updateUserV2 = async (id, name, permissionIds) => {
  const user = await searchUserFromDB(id);

  if (!user) {
    throw new UserNotFound(id);
  }

  return await updateUserInDB(id, name, permissionIds);
};

const insertUserIntoDB = (name, permissionIds = []) => {
  return Promise.resolve(`Name is ${name} and permitted ${permissionIds.toString()}`);
};

const searchUserFromDB = id => {
  if (id % 2 === 1) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
};

const updateUserInDB = (id, name, permissionIds) => {
  if (id % 2 === 1) {
    return Promise.resolve({ name, permissionIds });
  } else {
    return Promise.reject('Unexpected error has occured while querying to DB');
  }
};
