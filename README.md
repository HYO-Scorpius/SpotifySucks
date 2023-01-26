# Spotify Sucks
Web app that adds some useful features to Spotify
<br></br>

# Run Locally

## Prerequisites

### Setup
- For this repository to your account, and clone the repo to your machine
- Installed [Node.js version 12.18.0](https://nodejs.org/en/)
- [Created a spotify application](https://developer.spotify.com/my-applications/)
- [Created mongodb atlas cluster](https://www.mongodb.com/cloud/atlas?utm_campaign=atlas_bc_mern&utm_source=medium&utm_medium=inf&utm_term=campaign_term&utm_content=campaign_content)
<br></br>

### Environment Variables
Create environment files within `frontend` and `backend`
```
touch frontend/.env && touch backend/.env
```

Place the following into `backend/.env`
```
SPOTIFY_CLIENT_ID=<CLIENT_ID>
SPOTIFY_CLIENT_SECRET=<CLIENT_SECRET>
ATLAS_URI=<DB_URI>
```

`<CLIENT_ID>` and `<CLIENT_SECRET>` comes from your Spotify application page.

`DB_URI` comes from your MongoDB Atlas account.
   1. Click "Connect"
   2. Choose "Connect your application"
   3. Copy the box of text containing your connection URI
   4. Paste over `<DB_URI>`
   5. Replace `<password>` with your MongoDB Atlass account password

Place the following into `frontend/.env`
```
REACT_APP_API_URL=http://localhost:1337 
```

### Dependencies
From project root install root dependencies
```
npm install
```

Concurrently install dependencies for `frontend` and `backend`
```
npm run installation
```

## Building

### Run the entire project
TODO: Does not work
```
npm run start
```

### Isolate the frontend or backend
TODO: Does not work
```
npm run [frontend | backend]
```

### Start a development server to see your changes rendered live as you make them
```
npm run dev
```
- View the rendered content at [http://localhost:3000](http://localhost:3000).  


