# Holonow-Server

API that retrieves data from youtube XML and youtube API and returns live/upcoming/previous live streams of vtuber group Hololive.

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes. 

### Prerequisites

Requirements for the software and other tools to build, test and push 
- have MongoDb atlas account setup or MongoDb set up locally 
- have a google account so you can generate a youtube API key

### Installing

A step by step series of examples that tell you how to get a development
environment running

1. Log into https://console.cloud.google.com/ 
2. Navigate to APIs & Services
3. Create a new project in Google cloud
4. Enable YouTube Data API v3
5. In YouTube Data API v3, create a new API key in the credientials tab
6. Clone this repository
7. Create a .env file
8. in .env add mongodb uri to MONGO_URL ('mongodb+srv://{userName}:{password}@{collectionName}.qxqec.mongodb.net/{tableName}?retryWrites=true&w=majority')
9. in .env add youtube api key to YOUTUBE_TOKEN
10. in .env add NODE_ENV='development'
11. Go to https://console.cloud.google.com
11a. On the sidebar go to Credentials > "+ CREATE CREDENTIALS" > "OAuth client ID"
11b. Set application type to "Web application" and give it a name
11c. In Authorized redirect URIs add the following 
http://localhost:3001/api/v1/oauth2/redirect/google, http://localhost:3000/api/v1/oauth2/redirect/google, https://holonowapi.onrender.com/api/v1/oauth2/redirect/google, https://holonow.netlify.app/api/v1/oauth2/redirect/google
11d. Press create
11e. In .env add your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

After starting the server with npm run start
You should now be able to call http://localhost:{port}/api/v1/videos and get all videos/livestreams

## Challenges
- limited to 10000 quota per day using youtube API
  - getting videos from channels > playlist > video would cost around (numChannels*2)+(numChannels/50), currently look up 57 channels so it would only be able to refresh the livestreams 86 times before I have to wait 24 hours
  - workaround: use the free RRS feed
    - this doesn't always update right away so some livestreams appear as live when they have already ended 

## Things to do
- [ ] make use of cache to avoid writing to the db everytime
- [x] add table for authors that includes their profile pic
- [x] add authentication
- [x] add favorites for users
- [x] add search endpoint
- [x] add documentation on how to setup OAuth 2.0 Client IDs
- [x] deploy it somewhere
- [ ] fix but with shared favorites
- [ ] pagination videos
- [ ] create interval to update videos instead of on every /live request
## Deployment
- Deployed using Render

## Built With
  - Mongo
  - Expressjs
  - Nodejs

## Authors
  - **Christopher Luong** 

  <!-- https://www.youtube.com/watch?v=cD17CYA1dck -->
