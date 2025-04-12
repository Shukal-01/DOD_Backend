const path = require("path");

const handleCreateNew = async (
  req,
  Model,
  skipArray,
  extra,
  filesPath,
  randomNumber,
  successCallback
) => {
  const data = req.body;
  const files = req.files;

  if (Object.keys(data).length < 1 && !files)
    return { message: "No data or files provided", data: [] };

  try {
    let updatableData = {};

    // Process data fields
    for (const key in data) {
      if (!skipArray.includes(key)) {
        try {
          if (data[key]?.trim() !== "") {
            updatableData[key] = data[key];
          }
        } catch (error) {
          updatableData[key] = data[key];
        }
      }
    }

    // Process files
    if (files) {
      const promises = Object.entries(files).map(([key, file]) => {
        return new Promise((resolve, reject) => {
          const typeFolder = file.mimetype.includes("video")
            ? "videos"
            : file.mimetype.includes("image")
            ? "images"
            : null;

          if (!typeFolder) {
            resolve({ error: `${key}_fileTypeError` });
            return;
          }

          const uniqueNumber =
            randomNumber || Math.floor(Math.random() * 10000);
          const filename = `${file.md5}${uniqueNumber}.${
            file.mimetype.split("/")[1]
          }`;
          const movePath = path.join(
            __dirname,
            `../../assets/${filesPath}${typeFolder}/${filename}`
          );
          const urlPath = `${process.env.LIVEURL}/${filesPath}${typeFolder}/${filename}`;

          file.mv(movePath, (err) => {
            if (err) {
              resolve({ error: `File upload error for ${key}` });
            } else {
              updatableData[key] = urlPath;
              resolve({ success: true });
            }
          });
        });
      });

      const fileResults = await Promise.all(promises);
      const errors = fileResults.filter((res) => res.error);
      if (errors.length) {
        return { message: "File upload error", data: errors };
      }
    }

    // Merge additional data
    updatableData = { ...updatableData, ...extra, Date: new Date() };

    // Save to the database
    const isAdded = await Model.create(updatableData);
    if (isAdded) {
      if (successCallback) {
        return successCallback(isAdded);
      }
      return { message: "success", data: isAdded };
    }

    return { message: "Database save error", data: [] };
  } catch (error) {
    return {
      message: "An error occurred",
      data: [],
      detail: error.message,
    };
  }
};

module.exports = handleCreateNew;
