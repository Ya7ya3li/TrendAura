const usageDB = [];

export const saveUsage = async (userId, prompt, result) => {
  usageDB.push({
    userId,
    prompt,
    result,
    date: new Date(),
  });
};

export const getUsage = (req, res) => {
  res.json(usageDB);
};