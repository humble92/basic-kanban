import { getConnection, getRepository } from 'typeorm';
import { ListNotFound } from '../error';
import List from '../entities/list';
/**
 * Get all lists with cards assigned
 *
 * @returns all lists
 */
export const getAllList = async () => {
  return await getRepository(List).find({ relations: ['cards'] });
};

/**
 * Get a list by listId with cards assigned
 *
 * @param  {number} listId
 * @returns a list
 */
export const getListById = async (listId) => {
  const list = await getRepository(List).findOneOrFail(listId, { relations: ['cards'] });

  // not touched in the case of findOneOrFail
  // if (!list) {
  //   throw new ListNotFound(listId);
  // }
    
  return list;
};

/**
 * Create a new list
 *
 * @param {string} title
 * @returns created list
 */
export const createList = async title => {

  const saveObject = { title };

  // const listWithLastIndex = await getRepository(List).findOne({ order: { index: 'DESC' } });
  const listWithLastIndex = await getRepository(List)
      .createQueryBuilder()
      .select('MAX(index)', 'maxIndex')
      .getRawOne();

  saveObject.index = (listWithLastIndex.maxIndex === null) ? 0: listWithLastIndex.maxIndex + 1;

  return await getRepository(List).save(saveObject);
};

/**
 * Update a list
 *
 * @param listId
 * @param {string} title
 * @returns updated list
 */
export const updateList = async (listId, requestBody) => {
  const { index: newIndex, title } = requestBody;  
  const list = await getRepository(List).findOneOrFail(listId);

  if (!list) {
    throw new ListNotFound(listId);
  }  

  if (title) {
    // await getRepository(List).update(listId, { title });
    list.title = title;
    return await getRepository(List).save(list);
  }

  const originIndex = list.index;
  // same position as before
  if (newIndex === originIndex) {
    return list;
  }

  await getConnection().transaction(async transactionalEntityManager => {
    transactionalEntityManager.query("set constraints all deferred");
    const updateObject = { index: newIndex };

    await transactionalEntityManager
      .createQueryBuilder()
      .update(List)
      .set({ index: null })
      .where('id = :id', { id: listId })
      .execute();

    if (originIndex < newIndex) {
      await transactionalEntityManager
        .createQueryBuilder()
        .update(List)
        .set({ index: () => 'index - 1' })
        .where('index > :originIndex AND index <= :newIndex', {
          originIndex,
          newIndex
        })
        .execute();
    } else {
      await transactionalEntityManager
        .createQueryBuilder()
        .update(List)
        .set({ index: () => 'index + 1' })
        .where('index < :originIndex AND index >= :newIndex', {
          originIndex,
          newIndex
        })
        .execute();
    }

    await transactionalEntityManager.getRepository(List).update(listId, updateObject);
  });
  
  return await getListById(listId);
};

/**
 * Delete a list
 *
 * @param listId listId
 */
export const deleteList = async (listId) => {
    const list = await getRepository(List).findOneOrFail(listId);

    const indexToRemove = list.index;
    await getConnection().transaction(async transactionalEntityManager => {
  
      await transactionalEntityManager.getRepository(List).delete(listId);
  
      await transactionalEntityManager
        .createQueryBuilder()
        .update(List)
        .set({ index: () => 'index - 1' })
        .where('index > :indexToRemove', { indexToRemove })
        .execute();
    });
};
