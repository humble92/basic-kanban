import { getConnection, getRepository } from 'typeorm';
import { ListNotFound, CardNotFound } from '../error';
import Card from '../entities/card';
import List from '../entities/list';

/**
 * Save a new card
 *
 * @param {string} text
 * @param {number} listId
 * @returns saved card
 */
export const createCard = async (text, listId) => {
  const list = await getRepository(List).findOne(listId);

  if (!list) {
    throw new ListNotFound(listId);
  }  

  const saveObject = { text, list };

  const cardWithLastIndex = await getRepository(Card).findOne({ where: { listId }, order: { index: 'DESC' } });

  saveObject.index = cardWithLastIndex ? cardWithLastIndex.index + 1 : 0;

  return await getRepository(Card).save(saveObject);
};

/**
 * Update a card
 *
 * @param {number} cardId
 * @param {object} requestBody that contains listId, index
 * @returns updated card
 */
export const updateCard = async (cardId, requestBody) => {
  const { listId: destListId, index: newIndex, text } = requestBody;
  const card = await getRepository(Card).findOne(cardId);

  if (!card) {
    throw new CardNotFound(cardId);
  }

  if (text) {
    card.text = text;
    return await getRepository(Card).save(card);
  }

  const originIndex = card.index;
  const originListId = card.listId;

  const destList = await getRepository(List).findOne(destListId);

  if (!destList) {
    throw new ListNotFound(destListId);
  }  

  // same position as before
  if (destListId === originListId && newIndex === originIndex) {
    return card;
  }

  await getConnection().transaction(async transactionalEntityManager => {
    const updateObject = { index: newIndex };

    await transactionalEntityManager
      .createQueryBuilder()
      .update(Card)
      .set({ index: null })
      .where('listId = :originListId AND id = :id', { originListId, id: cardId })
      .execute();

    // when moving to another list
    if (destListId !== originListId) {
      updateObject.listId = destListId;

      //update indecies of the origin list
      await transactionalEntityManager
        .createQueryBuilder()
        .update(Card)
        .set({ index: () => 'index - 1' })
        .where('listId = :originListId AND index > :indexToRemove', {
          originListId,
          indexToRemove: originIndex
        })
        .execute();

      //update indecies of the dest list
      await transactionalEntityManager
        .createQueryBuilder()
        .update(Card)
        .set({ index: () => 'index + 1' })
        .where('listId = :destListId AND index >= :newIndex', {
          destListId,
          newIndex
        })
        .execute();

      // when moving inside of the list
    } else {
      if (originIndex < newIndex) {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Card)
          .set({ index: () => 'index - 1' })
          .where('listId = :originListId AND index > :originIndex AND index <= :newIndex', {
            originListId,
            originIndex,
            newIndex
          })
          .execute();
      } else {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Card)
          .set({ index: () => 'index + 1' })
          .where('listId = :originListId AND index < :originIndex AND index >= :newIndex', {
            originListId,
            originIndex,
            newIndex
          })
          .execute();
      }
    }

    await transactionalEntityManager.getRepository(Card).update(cardId, updateObject);
  });

  return await getCardById(cardId);
};

/**
 * Get a card by cardId
 *
 * @param {number} cardId
 * @returns card
 */
export const getCardById = async (cardId) => {
  const card = await getRepository(Card).findOne(cardId, { relations: ['list'] });

  if (!card) {
    throw new CardNotFound(cardId);
  }

  return card;
};

/**
 * Delete a card by cardId
 *
 * @param {number} cardId
 */
export const deleteCard = async (cardId) => {
  const card = await getRepository(Card).findOne(cardId);

  await getConnection().transaction(async transactionalEntityManager => {
    const indexToRemove = card.index;

    await transactionalEntityManager.getRepository(Card).delete(cardId);

    await transactionalEntityManager
      .createQueryBuilder()
      .update(Card)
      .set({ index: () => 'index - 1' })
      .where('listId = :listId AND index > :indexToRemove', { listId: card.listId, indexToRemove })
      .execute();
  });
};