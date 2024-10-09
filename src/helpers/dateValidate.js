const dateValidate = (compareDay, root, min, max) => {
  const mileStone = new Date(root);
  const dayConvert = new Date(compareDay);

  let year = mileStone.getFullYear() - dayConvert.getFullYear();
  const month = mileStone.getMonth() - dayConvert.getMonth();
  const day = mileStone.getDate() - dayConvert.getDate();

  if (month < 0 || (month === 0 && day < 0)) year--;

  return year >= min && year <= max;
};

module.exports = dateValidate;
