# Sound Swipe

SoundSwipe is a mobile app that reduces the hassle of discovering and saving new music down to a few simple swiping actions. Through a clean and modulated UI design, users will swipe through snippets of tracks and choose from various options to organize their new finds straight into their Apple Music accounts.

### Mockups:
<img height="350" alt="Screenshot 2025-02-21 at 7 15 16 PM" src="https://github.com/user-attachments/assets/cc5d58a4-e878-4d15-ab93-ffe592cd1c76" />
<img height="350" alt="Screenshot 2025-02-21 at 7 15 30 PM" src="https://github.com/user-attachments/assets/9484e57f-577b-4328-af73-54d9bb12a60d" />
<img height="350" alt="Screenshot 2025-02-21 at 7 15 39 PM" src="https://github.com/user-attachments/assets/eb925d37-a245-403b-8283-3e05519ee099" />
<img height="350" alt="Screenshot 2025-02-21 at 7 15 48 PM" src="https://github.com/user-attachments/assets/ba696b11-7333-4609-a7da-5d49b443ee64" />
<img height="350" alt="Screenshot 2025-02-21 at 7 15 58 PM" src="https://github.com/user-attachments/assets/4928a94a-fb44-4879-95f5-2f6ee12cafbc" />


## Architecture

We will be building a web app using React Native. We plan on having three main pages: profile, feed, and new search. 

### Profile
Profile will hold a user's profile and user analytics such as past searches and song history. We plan on having past searches displayed below the user profile and having a button to see a limited history of recently viewed songs.

### Feed
Feed will serve as the container for all our song suggestions. We plan to display each song as a card on the user's screen, allowing them to swipe right to add it to a specific playlist, swipe left to add it to their liked songs or swipe up to skip the current track. Users can tap a card to reveal detailed information about the artist, song history, and recommendations.

Each song card will feature the album cover, song title, and artist, and will play the most relevant section of a song (e.g., the chorus) for quicker discovery. Users will also be able to play, pause, and adjust the song's progress. We'll likely use a react native card library.

Given that our song feed relies heavily on swipe gestures, we’ll likely make use of the react-native-gesture-handler library for detecting gestures and react-native-reanimated to create customized swipe animations and dynamics.

### New Search
New Search will give users the ability to customize their music search with various input fields to modify and a button to start the search.

## Setup

To set up the project development environment, following the instructions below:
1. Clone the repository:
```
git clone https://github.com/dartmouth-cs52-25w/project-soundswipe/tree/main
```
2. CD into mobile-app folder:
```
cd mobile-app
```
3. Install dependencies:
```
npm install
```
4. Start the development server:
```
npx expo start --tunnel
```
5. You should now see a QR code. Scan it to view our app in Expo Go!

## Deployment

[Deployed Backend API URL](https://soundswipe.onrender.com/api/v1)

## Authors

Kellen Seeley, Will Beeson, Daniel Amoeteng, Chikwanda Chisha, Maddy Slater, and Chloe Yoo

## Acknowledgments

We will be implementing a variety of react native libraries as well as utilizing the Apple Music developer API endpoints.
