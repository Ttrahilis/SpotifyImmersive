# SpotifyImmersive
Reverse-engineered the Spotify Web Player (desktop site) to inject custom JavaScript via a Tampermonkey script, adapting the interface for a more mobile-friendly experience. This is done entirely client-side—no API usage, no server interaction, and no redistribution of Spotify assets.

# Purpose:
Educational use only. Demonstrates DOM manipulation and UI adaptation techniques using browser extensions.
# Download Firefox Extension
[Download latest version here](https://github.com/Ttrahilis/SpotifyImmersive/builds/spotifyimmersive-latest.xpi)  

[See older versions](https://github.com/Ttrahilis/SpotifyImmersive/builds/)
# How to Contribute
### Dependencies
- Firefox

### Run instructions
- Open Git Bash.
- Navigate into your working directory of choice
- Clone the SpotifyImmersive repo:  
`git clone https://github.com/Ttrahilis/SpotifyImmersive`
- Enter cloned repo:  
`cd SpotifyImmersive`

- Find your firefox profile directory (to open a firefox instance where you are already logged in to spotify)

  <details>
  <summary>Click here to see how</summary>
  To find your Firefox profile:  
  - go to the url about:support  
    
  - Ctrl+F: search keyword Profile Folder
    
  - Copy the folder url to your right.
    
  - It should look like C:/Users/MYUSER/AppData/Roaming/Mozilla/Firefox/Profiles/MYPROFILE.default  
  </details>
- Save the directory into the *profile* file:  
  `echo "C:/Users/MYUSER/AppData/Roaming/Mozilla/Firefox/Profiles/MYPROFILE.default" > profile`

- To run the project:  
`./run`
### Build instructions
- Make sure you can [run](https://github.com/Ttrahilis/SpotifyImmersive/edit/main/README.md#run-instructions](https://github.com/Ttrahilis/SpotifyImmersive/tree/main?tab=readme-ov-file#run-instructions) the project first
- To build the project:
`./build`
