let getChatArr = function (type, id) {
  return [
    {
      chart_type: type,
      id: `mc_${type}_${id}`,
    },
  ];
};

export {
  getChatArr
};
