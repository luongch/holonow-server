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
8. in .env add mongodb uri to MONGO_URL
9. in .env add youtube api key to YOUTUBE_TOKEN
10. TODO: add instructions on how to setup OAuth 2.0 Client IDs

After starting the server with npm run start
You should now be able to call http://localhost:{port}/api/v1/videos and get all videos/livestreams

## Challenges
- limited to 10000 quota per day using youtube API
  - getting videos from channels > playlist > video would cost around (numChannels*2)+(numChannels/50), currently look up 53 channels so it would only be able to refresh the livestreams 93 times before I have to wait 24 hours
  - workaround: use the free RRS feed
    - this doesn't always update right away so some livestreams appear as live when they have already ended 

## Things to do
- [ ] make use of cache to avoid writing to the db everytime
- [ ] add table for authors that includes their profile pic
- [x] add authentication
- [ ] add favorites for users
- [x] add search endpoint
- [ ] add documentation on how to setup OAuth 2.0 Client IDs
- [ ] deploy it somewhere

## Deployment



## Built With
  - Mongo
  - Expressjs
  - Nodejs

## Authors
  - **Christopher Luong** 
