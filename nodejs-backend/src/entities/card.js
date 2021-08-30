import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Card',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    text: {
      type: 'varchar',
      length: 50
    },
    index: {
      type: 'int',
      nullable: true
    },
    listId: {
      type: 'int'
    }
  },
  relations: {
    list: {
      type: 'many-to-one',
      target: 'List',
      onDelete: 'CASCADE',
      inverseSide: "cards"
    }
  },
  uniques: [
    {
      name: "UQ_CARD_COL_INDEX",
      columns: [
        "listId",
        "index"
      ]
    }
  ]
});
