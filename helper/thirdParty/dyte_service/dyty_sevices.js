const dyteConfig = require("./dyte_config");

const createNewMeeting = async (meetingTitle) => {
  // generating buffer of key
  const combinedKey = `${dyteConfig.orgId}:${dyteConfig.apiKey}`;
  const base64 = Buffer.from(combinedKey).toString("base64");

  //   from https://docs.dyte.io/api#/operations/create_meeting
  const url = "https://api.dyte.io/v2/meetings";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${base64}`,
    },
    body: JSON.stringify({
      title: `${meetingTitle}`,
      preferred_region: "ap-south-1",
      record_on_start: false,
      live_stream_on_start: false,
      recording_config: {
        max_seconds: 60,
        file_name_prefix: "string",
        video_config: {
          codec: "H264",
          width: 1280,
          height: 720,
          watermark: {
            url: "http://example.com",
            size: { width: 1, height: 1 },
            position: "left top",
          },
          export_file: true,
        },
        audio_config: { codec: "AAC", channel: "stereo", export_file: true },
        storage_config: {
          type: "aws",
          access_key: "string",
          secret: "string",
          bucket: "string",
          region: "us-east-1",
          path: "string",
          auth_method: "KEY",
          username: "string",
          password: "string",
          host: "string",
          port: 0,
          private_key: "string",
        },
        dyte_bucket_config: { enabled: true },
      },
      ai_config: {
        transcription: {
          keywords: ["string"],
          language: "en-US",
          profanity_filter: false,
        },
        summarization: {
          word_limit: 500,
          text_format: "markdown",
          summary_type: "general",
        },
      },
      persist_chat: false,
      summarize_on_end: false,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.success) {
      return { message: "success", data: { roomId: data.data.id } };
    }
    return { message: "error", detail: "error" };
  } catch (error) {
    // console.error(error);
  }
};

const createDyteMeetingUserToken = async (meetingId, userName, userId) => {
  // generating buffer of key
  const combinedKey = `${dyteConfig.orgId}:${dyteConfig.apiKey}`;
  const base64 = Buffer.from(combinedKey).toString("base64");
  const url = `https://api.dyte.io/v2/meetings/${meetingId}/participants`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${base64}`,
    },
    body: JSON.stringify({
      name: userName,
      picture: "https://i.imgur.com/test.jpg",
      preset_name: "group_call_host",
      custom_participant_id: userId,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.success) {
      return { message: "success", data: { token: data.data.token } };
    }
    return { message: "error", detail: "error" };
  } catch (error) {
    // console.error(error);
  }
};

const dyteServices = { createNewMeeting, createDyteMeetingUserToken };

module.exports = dyteServices;
