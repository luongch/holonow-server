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

After starting the server with npm run start
You should now be able to call http://localhost:{port}/api/v1/videos and get all videos/livestreams


## Deployment



## Built With
  - Mongo
  - Expressjs
  - Nodejs

## Authors
  - **Christopher Luong** 
