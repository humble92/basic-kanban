import * as ListService from "../services/list";

export const getAllList = async (req, res) => {
  return res.ok(await ListService.getAllList());
};

export const getListById = async (req, res) => {
  return res.ok(await ListService.getListById(req.params.id));
};

export const createList = async (req, res) => {
  return res.created(await ListService.createList(req.body.title));
};

export const updateList = async (req, res) => {
  return res.ok(await ListService.updateList(req.params.id, req.body));
};

export const deleteList = async (req, res) => {
  ListService.deleteList(req.params.id)
  return res.noContent();
};
