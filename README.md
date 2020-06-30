# SpotifySucks
Web app that adds some useful features to Spotify

# BUILDING

## Requirements
- [Node version 12.18.0](https://nodejs.org/en/)
   - If you're on Unix/macOS/WSL, consider using [nvm](https://github.com/nvm-sh/nvm#about) to install instead.

- Environment Variables
   - [create a spotify application](https://developer.spotify.com/my-applications/)
   - [create mongodb atlas cluster](https://www.mongodb.com/cloud/atlas?utm_campaign=atlas_bc_mern&utm_source=medium&utm_medium=inf&utm_term=campaign_term&utm_content=campaign_content)
   
   - create a file in the backend/ folder called .env
   - add the following to your .env file
   - ``` 
     SPOTIFY_CLIENT_ID=<CLIENT_ID>
     SPOTIFY_CLIENT_SECRET=<CLIENT_SECRET>
     ATLAS_URI=<DB_URI>
     ```
   - The <DB_URI> looks something like this: ```mongodb+srv://username:```<password>```@cluster.gcp.mongodb.net/test?retryWrites=true```
   - Replace ```<password>``` with the password set when creating the user in the Database Setup

## Database Setup
1. Create ```New Project``` >> ```Build a cluster``` 
2. Go to the ```Database``` tab under 'Security' and ```Add a new database user``` with a desired password.
3. Next, go to ```Network Access``` >> ```Add an IP Address``` There should be a button where you can automatically retrieve your IP. 
4. After the following steps, go back to ```Clusters``` and click ```Connect``` >> ```Connect your Application``` >> ```Copy```
   - This retrieves the database URI. It is used in the .env above to connect to the database.

(Note: Under 'Collections' in the Clusters tab, you can view the data saved.)

## Setup

1. Hit the *Fork* button in the top right corner to fork the repository to your GitHub.

2. Clone the resulting repository.
```
git clone  <repo-url>
```

If you don't [have SSH keys set up](https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) with your GitHub, you can also use
```
git clone https://github.com/<your GitHub username>/HYO-Summer2020-Orientation
```

3. Enter the cloned repository and install dependencies.
```
cd SpotifySucks
npm install && cd backend && npm install && cd ../frontend && npm install 
```

4. Start a development server to see your changes rendered live as you make them.
```
npm run dev
```

5. View the rendered content at [http://localhost:3000](http://localhost:3000).  
