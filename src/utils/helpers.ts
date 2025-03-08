export const combinedArray = (arr: Array<any>) =>
  arr
    .map((_, index, array) => {
      if (index % 2 === 0) {
        return [array[index], array[index + 1]];
      }
      return null;
    })
    .filter((item): item is [any, any] => item !== null && item !== undefined);
