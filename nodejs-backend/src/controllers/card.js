import * as CardService from '../services/card';

export const createCard = async (req, res) => {
  return res.created(await CardService.createCard(req.body.text, req.body.listId));
};

export const updateCard = async (req, res) => {
  return res.ok(await CardService.updateCard(+req.params.id, req.body));
};

export const getCardById = async (req, res) => {
  return res.ok(await CardService.getCardById(+req.params.id));
};

export const deleteCard = async (req, res) => {
  await CardService.deleteCard(+req.params.id);
  return res.noContent();
};
