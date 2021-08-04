const videoListApi = require('./search/video-list-api')
const videoInfoApi = require('./search/video-info-api')

const main = async() => {
    // get all the videos latest videos for each channel    
    let videoList = await videoListApi();

    let videoInfo = await videoInfoApi(videoList);
    console.log("videoInfo", videoInfo.data.items)
    //do a batch request for each videoId and determine if it is live/upcoming or not

}

main();