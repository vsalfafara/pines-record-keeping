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

  let totalAvailableLots = 0;
  let totalTakenLots = 0;

  const propertiesInfo = data.map((property) => {
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

    totalAvailableLots += availableLots;
    totalTakenLots += takenLots;

    return {
      noOfBlocks,
      noOfLots,
      takenLots,
      availableLots,
      ...otherPropertyInfo,
    };
  });
  return {
    properties: propertiesInfo,
    totalAvailableLots,
    totalTakenLots,
  };
});
