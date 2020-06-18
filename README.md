#SpotifySuck
Web app that adds some useful features to Spotify

# BUILDING

## Requirements
- [Node version 12.18.0](https://nodejs.org/en/)
   - If you're on Unix/macOS/WSL, consider using [nvm](https://github.com/nvm-sh/nvm#about) to install instead.

- Environment Variables
   - [create a spotify application](https://developer.spotify.com/my-applications/)
   - Set client id and client secret environment variables
   - ``` 
     export SPOTIFY_CLIENT_ID=<CLIENT_ID>
     export SPOTIFY_CLIENT_SECRET=<CLIENT_SECRET>
     ```

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

5. View the rendered content at [http://localhost:1337](http://localhost:1337).  
