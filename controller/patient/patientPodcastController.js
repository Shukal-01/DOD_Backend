const doctorPodcastSessionModel = require("../../model/doctorPodcastSession");

const getPodcastDetails = async (req, res) => {

    const podcastSessionId = req.params.itemId

    if (!podcastSessionId) {
        return res.status(404).json({ message: 'error', detail: 'session not found!' })
    }

    const podcastDetails = await doctorPodcastSessionModel.findById(podcastSessionId);

    return res.status(200).json({
        message: 'success', data: {
            token: podcastDetails.viewerToken,
            chanelName: podcastDetails._id,
            // messages: podcastDetails.messages,
            startTime: podcastDetails.sesstionStartTime,
        }
    });
}


module.exports = { getPodcastDetails }