import { Router } from 'express';
import { Events } from '../constants';
import { UserNotFound } from '../error';
import { catchAsync } from '../middleware/error';
import { idPathValidation, requestBodyValidate } from '../middleware/requestValidation';
import EventManager from '../utils/eventManager';
import { postListSchema, updateListSchema } from '../validationSchemas/list';

import * as ListController from '../controllers/list';

const router = Router();

// get all list with tasks assgined
router.get('/', ListController.getAllList);

router.get('/:id', 
    idPathValidation, 
    catchAsync(ListController.getListById)
);

router.post('/', 
    requestBodyValidate(postListSchema),
    catchAsync(ListController.createList)
);

router.patch('/:id', 
    idPathValidation, 
    requestBodyValidate(updateListSchema),
    catchAsync(ListController.updateList)
);

router.delete('/:id', 
    idPathValidation, 
    catchAsync(ListController.deleteList)
);

export default router;
