const handleGetWithMsg = async (req, res, Model, find, isReversed) => {
  let storyData = await Model.find(find);

  if (storyData) {
    if (storyData.length > 0) {
      let actualData = storyData;
      if (isReversed) {
        actualData.reverse();
      }
      res.status(200).json({
        message: "success",
        data: [...actualData, ...actualData, ...actualData, ...actualData, ...actualData, ...actualData, ...actualData, ...actualData, ...actualData],
      });
    } else {
      res.status(200).json({ message: "success", data: [] });
    }
  } else {
    res.status(200).json({ message: "success", data: [] });
  }
};

module.exports = handleGetWithMsg;
