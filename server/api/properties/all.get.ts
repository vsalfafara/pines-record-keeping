import { db } from "~/db";

export default defineEventHandler(async () => {
  const data = await db.query.properties.findMany({
    with: {
      blocks: {
        with: {
          lots: true,
        },
      },
    },
  });

  return data.map((property) => {
    const { blocks, ...otherPropertyInfo } = property;

    const noOfBlocks = property.blocks.length;
    const noOfLots = blocks.reduce((current: number, block) => {
      return (current += block.lots.length);
    }, 0);
    const takenLots = blocks.reduce((current: number, block) => {
      return (current += block.lots.filter((lot) => lot.taken).length);
    }, 0);
    const availableLots = blocks.reduce((current: number, block) => {
      return (current += block.lots.filter((lot) => !lot.taken).length);
    }, 0);

    return {
      noOfBlocks,
      noOfLots,
      takenLots,
      availableLots,
      ...otherPropertyInfo,
    };
  });

  return data;

  return await db.query.properties.findMany({
    with: {
      blocks: {
        with: {
          lots: true,
        },
      },
    },
  });
});
