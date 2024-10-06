const dateValidate = (birthday, minAge, maxAge) => {
  const today = new Date();
  const birthDay = new Date(birthday);

  const year = today.getFullYear() - birthDay.getFullYear();
  const month = today.getMonth() - birthDay.getMonth();
  const day = today.getDate() - birthDay.getDate();

  if (month < 0 || (month === 0 && day < 0)) year--;

  return year >= minAge && year <= maxAge;
};

module.exports = dateValidate;
