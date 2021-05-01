## 🍎 pantree food donation platform

Pantree is a web app focused on helping reduce food waste. Our goal is to establish a strong link between community fridges and local food businesses – pantree does this by allowing potential donations to be listed for collection. Community fridge operators can claim any food donations which would otherwise go to waste. Our platform also allows local businesses to donate any surplus food to community fridges. With pantree, we aim to raise awareness of community fridges, bring communities together, and minimise food waste.

The web app has been designed by researching the users needs from a donation platform.

## 📦 Tech Stack

### Frontend

Pug
SASS
JavaScript

### Backend

NodeJS
Express
MongoDB

### Libraries & Packages

Passport.js

### APIs

Google Maps
Food Hygiene Rating Scheme
Mailtrap

## Demo Site

CLICK HERE

### localhost usage

Node needs to be installed before following these instructions:

Download ZIP folder
Extract contents
Open bash terminal in folder
npm install
npm start
Navigate to localhost:7777

## Known Issues

fullScreenRequest requires user interaction. Not able to fire custom event for this. Need to mimic something close to full screen behaviour.
No sound in video. This is due to how video is encoded. Sounds seems to be stripped. Looking for fix.
Sound FX need mouse interaction to start in Chrome. Not sure if there is a workaround for this?
Sometimes motion gestures result in custom event firing twice.

## Potential Improvements

Add gesture recognition for two hands (this is waiting for update from Tensorflow team)
Remove any unused CSS and JS to reduce overall app size
Fine tune the gestures so they are recognised better
Make progressive enhancement more graceful when using a browser other than Chrome
Improve speech recognition so more general phrases could be used
Add speech synthesis so voice feedback is provided to user

## 📚 References
