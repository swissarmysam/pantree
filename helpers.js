/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2);

// a helper to create a static map
exports.staticMap = ([lng, lat]) =>
  `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${
    process.env.MAP_KEY
  }&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = name => fs.readFileSync(`./lib/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `pantree #reducingfoodwaste`;

exports.menu = [
  { slug: '/about', title: 'About', icon: 'info' },
  { slug: '/map', title: 'Map', icon: 'pin' },
];
