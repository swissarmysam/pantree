/* eslint-disable prettier/prettier */
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
  { slug: '#home', title: 'Home', icon: 'home' },
  { slug: '#about', title: 'About', icon: 'info' },
  { slug: '#contact', title: 'Contact', icon: 'contact' },
];

// TO-DO render sidemenu links based on user type
exports.coordinatorMenu = [
  [
    { slug: '/donations', title: 'Food donations', icon: 'fruit-apple' },
    { slug: '/presskit', title: 'Presskit', icon: 'post' },
  ],
  [
    { slug: '/donations/manage', title: 'Claimed donations', icon: 'box' },
    { slug: '/establishment/edit', title: 'Fridge info', icon: 'edit' },
  ]
];

exports.businessMenu = [
  [{ slug: '/donations', title: 'Food donations', icon: 'fruit-apple' }],
  [
    { slug: '/donations/donation/add', title: 'Add donation', icon: 'add-circle' },
    { slug: '/donations/manage', title: 'Manage donations', icon: 'box' },
    { slug: '/establishment/edit', title: 'Business info', icon: 'edit' },
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

exports.presskitPosters = [
  {
    no: 1,
    title: 'Poster 1',
    tags: ['join', 'info'],
  },
  {
    no: 2,
    title: 'Poster 2',
    tags: ['goals', 'community', 'educate'],
  },
  {
    no: 3,
    title: 'Poster 3',
    tags: ['join', 'surplus', 'community'],
  },
  {
    no: 4,
    title: 'Poster 4',
    tags: ['activities', 'info'],
  },
  {
    no: 5,
    title: 'Poster 5',
    tags: ['waste', 'tip', 'tomatoes', 'advice'],
  },
  {
    no: 6,
    title: 'Poster 6',
    tags: ['waste', 'tip', 'carrot', 'advice'],
  },
  {
    no: 7,
    title: 'Poster 7',
    tags: ['waste', 'tip', 'lemons', 'advice'],
  },
  {
    no: 8,
    title: 'Poster 8',
    tags: ['waste', 'tip', 'bread', 'advice'],
  },
  {
    no: 9,
    title: 'Poster 9',
    tags: ['waste', 'tip', 'compost', 'advice'],
  },
  {
    no: 10,
    title: 'Poster 10',
    tags: ['info', 'fridge'],
  },
]