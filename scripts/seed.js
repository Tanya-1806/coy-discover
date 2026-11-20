// Deterministic seed: node scripts/seed.js  ->  data/profiles.json (30 profiles)
const fs = require('fs');
const path = require('path');

const names = ['Aarav Mehta','Ananya Iyer','Kabir Malhotra','Diya Kapoor','Rohan Verma','Ishita Sharma','Vihaan Singh','Meera Nair','Arjun Reddy','Saanvi Gupta','Aditya Joshi','Riya Bansal','Karan Chopra','Tara Menon','Yash Agarwal','Naina Sethi','Dev Khanna','Kiara Bhatia','Nikhil Rao','Aisha Khan','Pranav Desai','Simran Kaur','Ayaan Ahmed','Myra Fernandes','Harsh Tiwari','Zoya Siddiqui','Rahul Pillai','Avni Saxena','Ishaan Bose','Pooja Rawat'];
const places = ['Delhi University','IIT Delhi','Ashoka University','Christ University, Bengaluru','Symbiosis, Pune','Manipal University','BITS Pilani','Amity University, Noida','Shiv Nadar University','NMIMS Mumbai','Jamia Millia Islamia','SRCC, Delhi','VIT Vellore','Ahmedabad University','Gurgaon'];
const interests = ['Coffee','Football','Indie music','Stand-up comedy','Hiking','Photography','Gaming','Cooking','Reading','Anime','Gym','Travel','Dancing','Movies','Chess','Painting','Podcasts','Cricket','Street food','Coding'];
const bios = ['Will trade playlists for good chai.','Professional overthinker, amateur chef.','Looking for someone to split fries with.','Weekend trekker, weekday napper.','Ask me about my favourite underrated film.','Can lose you at chess, will win you at Uno.','Always up for a late-night Maggi run.','Dog person who is learning to like cats.','Gym at 6am, memes at 6pm.','Collects concert wristbands and bad puns.','Fluent in sarcasm and Hindi film dialogues.','Currently reading three books, finishing none.','Sunsets, filter coffee, long walks.','Will definitely beat you at FIFA.','Part-time dreamer, full-time snack hoarder.'];

const profiles = names.map((name, i) => ({
  id: 'p' + String(i + 1).padStart(2, '0'),
  name,
  age: 18 + ((i * 7) % 8),
  photo: 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + encodeURIComponent(name),
  bio: bios[(i * 4 + 1) % bios.length],
  place: places[(i * 7) % places.length],
  interests: [0, 5, 10].map((k) => interests[(i * 3 + k) % interests.length]),
  likedYou: i % 3 === 1, // server-side only; never sent to the client
}));

fs.writeFileSync(path.join(__dirname, '..', 'data', 'profiles.json'), JSON.stringify(profiles, null, 2));
console.log(`Seeded ${profiles.length} profiles (${profiles.filter((p) => p.likedYou).length} already like you).`);
