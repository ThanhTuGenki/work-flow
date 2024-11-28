export const awaitFor = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
