# Sound Swipe

SoundSwipe is a mobile app that reduces the hassle of discovering and saving new music down to a few simple swiping actions. Through a clean and modulated UI design, users will swipe through snippets of tracks and choose from various options to organize their new finds straight into their Apple Music accounts.

### Mockups:


## Architecture

We will be building a web app using React Native. We plan on having three main pages: profile, feed, and new search. 

### Profile
Profile will hold a user's profile as well as user analytics such as past searches and song history. We plan on having past searches displayed below the user profile and having a button to see a limited history of recently viewed songs.

### Feed
Feed will serve as the container for all our song suggestions. We plan to display each song as a card on the user's screen, allowing them to swipe right to add it to a specific playlist, swipe left to add it to their liked songs, or swipe up to skip the current track. Users can tap a card to reveal detailed information about the artist, song history, and recommendations.

Each song card will feature the album cover, song title, and artist, and will play the most relevant section of a song (e.g., the chorus) for quicker discovery. Users will also be able to play, pause, and adjust the song's progress. We'll likely use a react native card library.

Given that our song feed relies heavily on swipe gestures, we’ll likely make use of the react-native-gesture-handler library for detecting gestures and react-native-reanimated to create customized swipe animations and dynamics.

### New Search
New Search will give users the ability to customize their music search with various input fields to modify and a button to start the search.

## Setup

To set up the project dev environment do the following:
`git clone https://github.com/dartmouth-cs52-25w/project-soundswipe/tree/main`
`cd project-soundswipe`
`npm install`
`npx expo start --tunnel`
Scan QR code to view our app in Expo Go!

## Deployment

TBD

## Authors

TODO: list of authors

## Acknowledgments

We will be implementing a variety of react native libraries as well as utilizing the Apple Music developer API endpoints.
