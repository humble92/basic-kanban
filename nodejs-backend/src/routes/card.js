import { Router } from "express";
import { Events } from '../constants';
import { UserNotFound } from '../error';
import { catchAsync } from '../middleware/error';
import { idPathValidation, requestBodyValidate } from '../middleware/requestValidation';
import EventManager from '../utils/eventManager';
import { postCardSchema, updateCardSchema } from '../validationSchemas/card';

import * as CardController from "../controllers/card";

const router = Router();

router.get("/:id",
    idPathValidation, 
    catchAsync(CardController.getCardById)
);

router.post("/",
    requestBodyValidate(postCardSchema),
    catchAsync(CardController.createCard)
);

router.patch("/:id",
    idPathValidation, 
    requestBodyValidate(updateCardSchema),
    catchAsync(CardController.updateCard)
);

router.delete("/:id",
    idPathValidation, 
    catchAsync(CardController.deleteCard)
);

export default router;
