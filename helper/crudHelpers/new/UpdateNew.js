const path = require("path");

const handleUpdate = async (
  req,
  Model,
  skipArray,
  extra,
  filesPath,
  UpdateObject
) => {
  const data = req.body;    
  const files = req.files;

  // If there's no data or files, return early
  if (Object.keys(data).length < 1 && !files)
    return { message: "error", error: "No data or files to update" };

  try {
    let updatableData = {};

    // Process text fields
    for (const key in data) {
      if (!skipArray.includes(key)) {
        updatableData[key] = data[key];
      }
    }

    // Handle file uploads
    if (files) {
      const fileProcessingPromises = Object.entries(files).flatMap(
        ([key, value]) => {
          const fileArray = Array.isArray(value) ? value : [value];
          return fileArray.map((file) => {
            return new Promise((resolve, reject) => {
              let fileType = key.includes("images")
                ? "images"
                : key.includes("videos")
                ? "videos"
                : null;
              if (!fileType) return resolve("unsupported");

              const randomNumber = Math.floor(Math.random() * 10000);
              const fileName = `${file.md5}${randomNumber}.${
                file.mimetype.split("/")[1]
              }`;

              if (fileName.includes("octet-stream")) {
                const replacement = fileType === "images" ? "png" : "mp4";
                fileName = fileName.replace("octet-stream", replacement);
              }

              const movePath = path.join(
                __dirname,
                `../../assets/${filesPath}${fileType}/${fileName}`
              );
              const urlPath = `${process.env.LIVEURL}/${filesPath}${fileType}/${fileName}`;

              file.mv(movePath, (err) => {
                if (err) {
                  console.error("File move error:", err);
                  resolve("notOk");
                } else {
                  if (!updatableData[fileType]) updatableData[fileType] = [];
                  updatableData[fileType].push(urlPath);
                  resolve("ok");
                }
              });
            });
          });
        }
      );

      await Promise.all(fileProcessingPromises);
    }

    // Merge extra data with updatable data
    updatableData = { ...updatableData, ...extra };

    // Perform the update operation
    const isUpdated = await Model.findOneAndUpdate(
      UpdateObject,
      updatableData,
      { new: true }
    );

    if (isUpdated) {
      return { data: isUpdated, message: "success" };
    } else {
      return { message: "error", error: "Update failed" };
    }
  } catch (err) {
    console.error("Error during update:", err.message);
    return { message: "error", error: err.message };
  }
};

module.exports = handleUpdate;
