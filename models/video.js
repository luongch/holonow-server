class Video {
    constructor(video) {
        this.id = video.id,        
        this.channelId = video.channelId,
        this.title = video.title,
        this.author = video.author,
        this.dateFetched = video.dateFetched
    }
}

module.exports = Video;