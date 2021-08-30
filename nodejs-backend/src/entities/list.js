import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'List',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    title: {
      type: 'varchar',
      length: 50
    },
    index: {
      type: 'int',
      nullable: true
    }
  },
  relations: {
    cards: {
      type: 'one-to-many',
      target: 'Card',
      inverseSide: "list"
    }
  },
  uniques: [
    {
      name: "UQ_LIST_COL_INDEX",
      columns: [
        "index"
      ]
    }
  ]
});
