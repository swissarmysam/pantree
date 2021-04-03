/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// a helper to create a static map
exports.staticMap = ([lng, lat]) =>
  `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `pantree`;

exports.menu = [
  { slug: '/about', title: 'About', icon: 'info' },
  { slug: '/map', title: 'Map', icon: 'pin' },
];

// TO-DO render sidemenu links based on user type
exports.sidemenuType1 = [
  [
    { slug: '/donations', title: 'Food donations', icon: 'Apple' },
    { slug: '/noticeboard', title: 'Noticeboard', icon: 'Clipboard' },
    { slug: '/presskit', title: 'Presskit', icon: 'TBD' },
  ],
  [
    { slug: '/add-activity', title: 'Add activity', icon: 'plus' },
    { slug: '/add-notice', title: 'Add notice', icon: 'plus' },
    { slug: '/edit-info', title: 'Fridge info', icon: 'edit' },
  ],
];

exports.foodFacts = [
  {
    fact: '13% of edible food and drink purchased by households are wasted',
    source: 'Biffa',
  },
  {
    fact:
      '3.6 million tonnes of food is wasted by the food industry every year in the UK',
    source: 'FareShare UK',
  },
  {
    fact:
      'Over 2 million tonnes of the food that goes to waste each year is still edible',
    source: 'WRAP UK',
  },
];
