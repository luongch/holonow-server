const videoListApi = require('./search/video-list-api')
const videoInfoApi = require('./search/video-info-api')

const main = async() => {
    // get all the videos latest videos for each channel    
    let videoList = await videoListApi();
    console.log(videoList)

    let videoInfo = await videoInfoApi(videoList);
    //do a batch request for each videoId and determine if it is live/upcoming or not

}

main();