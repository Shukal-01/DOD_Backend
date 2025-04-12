const path = require("path");

const handleUpdateNew2 = async (
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
  if (Object.keys(data).length < 1 && !files) {
    // console.log("No data or files to update");
    return { message: "error", error: "No data or files to update" };
  }

  try {
    let updatableData = {};

    // Process text fields
    for (const key in data) {
      if (!skipArray.includes(key)) {
        updatableData[key] = data[key];
      }
    }

    let promimse_all;
    if (files) {
      promimse_all = Promise.all(
        Object.entries(files).map((value, index) => {
          return new Promise((resolve, reject) => {
            let FilesArray = Object.keys(files);
            // console.log(FilesArray);
            if (FilesArray.length > 0) {
              let VideoOrImage = "";
              if (value[1].mimetype.includes("video")) {
                VideoOrImage = "videos";
              } else if (
                value[1].mimetype.includes("image") ||
                value[1].mimetype.includes("octet-stream")
              ) {
                VideoOrImage = "images";
              } else {
                resolve("error");
                return reject({ message: `${value[0]}_fileTypeError` });
              }

              const randomNumber = Math.floor(Math.random() * 10000);
              let movePath = path.join(
                __dirname,
                `../../../assets/${filesPath}${VideoOrImage}/${
                  value[1].md5 +
                  randomNumber +
                  "." +
                  value[1].mimetype.split("/")[1]
                }`
              );
              let urlPath =
                process.env.LIVEURL +
                `/${filesPath}/${VideoOrImage}/${
                  value[1].md5 +
                  randomNumber +
                  "." +
                  value[1].mimetype.split("/")[1]
                }`;

              value[1].mv(movePath, async (err) => {
                if (err) {
                  // console.log("File move failed:", err);
                  reject("notOk");
                } else {
                  updatableData[value[0]] = urlPath;
                  // console.log("File moved successfully:", urlPath);
                  resolve("ok");
                }
              });
            }
          });
        })
      );
    } else {
      promimse_all = Promise.resolve("ok");
    }

    // Wait for file upload promises to resolve before proceeding
    await promimse_all;

    // Add extra data to the updatableData object
    updatableData = { ...updatableData, ...extra };

    try {
      const isUpdated = await Model.findOneAndUpdate(
        UpdateObject,
        updatableData,
        { new: true }
      );

      if (isUpdated) {
        return { data: isUpdated, message: "success" };
      } else {
        // console.log("Update failed: No data found to update");
        return { message: "error", error: "Update failed" };
      }
    } catch (error) {
      console.error("Error during update:", error.message);
      return { message: "error", error: error.message };
    }
  } catch (err) {
    console.error("Error during update:", err.message);
    return { message: "error", error: err.message };
  }
};

module.exports = handleUpdateNew2;
