export const actNode = (data = [], index) => {
  let val = null;
  data.forEach(element => {
    if (element.node == index) val = element;
  });
  return val;
};
