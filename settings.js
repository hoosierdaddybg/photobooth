// =====================================================================
//  HOOSIER DADDY PHOTOBOOTH  -  all the stuff you might want to change
// =====================================================================
//  Edit this file to change words, colors, or which athletes show up.
//  You don't need to touch photobooth.js.
//
//  Each "cutout" below is one athlete/coach. Fields:
//    name    - big name shown on the card and printed on the photo
//    caption - little joke under the name
//    group   - which shelf it goes on (any text you want)
//    image   - the photo. Either a web address (https://...) or a file you
//              put in the images/ folder, like "images/beaumont.jpg".
//              Use null for a cartoon stand-in until you have a photo.
//    face    - where YOUR face goes, as fractions of the picture:
//              x, y   = center of the face (0 = left/top, 1 = right/bottom)
//              rx, ry = how wide / tall the oval is (half-width, half-height)
//              Use face-finder.html to get these numbers: drag a box over
//              the face and it prints the line for you to paste here.
//    credit  - who took the photo and the license (shown in tiny print on
//              the picture and in the credits box; CC licenses require it)
//    jersey  - only for cartoon stand-ins: the number on the jersey
// =====================================================================

const SETTINGS = {
  title: "HOOSIER DADDY PHOTOBOOTH",
  tagline: "Put your face on a Hoosier legend.",

  // Printed along the bottom of every photo. Put your real site address here.
  bannerText: "★ HOOSIER DADDY PHOTOBOOTH ★ #GOIU ★",

  // Colors. IU crimson and cream.
  colors: {
    crimson: "#990000",
    cream: "#EEEDEB",
    creamDark: "#DCD5C4",
    ink: "#1a0a0a",
    hot: "#ff2d6f",   // iCarly-ish pop color for stickers
    sky: "#3ec1ff",   // second pop color
  },

  // How much the camera is zoomed in on your face to start (the slider changes it).
  defaultZoom: 1.8,

  // Countdown length in seconds.
  countdownSeconds: 3,

  downloadName: "hoosier-daddy",
  shareText: "I'm basically a Hoosier legend now 🔴⚪ #GOIU",

  cutouts: [
    // ------------------------------ FOOTBALL ------------------------------
    {
      id: "cignetti",
      name: "Curt Cignetti",
      caption: "Google me.",
      group: "Football",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/2026-0117_Curt_Cignetti.jpeg/960px-2026-0117_Curt_Cignetti.jpeg",
      face: { x: 0.48, y: 0.43, rx: 0.165, ry: 0.22 },
      credit: { author: "Bobak Ha'Eri", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:2026-0117_Curt_Cignetti.jpeg" },
    },
    {
      id: "cignetti-field",
      name: "Curt Cignetti (Title Night)",
      caption: "On the field after the national title",
      group: "Football",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/2026-0119_NCG_postgame_Curt_Cignetti_on_field.jpg/960px-2026-0119_NCG_postgame_Curt_Cignetti_on_field.jpg",
      face: { x: 0.52, y: 0.33, rx: 0.125, ry: 0.175 },
      credit: { author: "Bobak Ha'Eri", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:2026-0119_NCG_postgame_Curt_Cignetti_on_field.jpg" },
    },
    {
      id: "mendoza",
      name: "Fernando Mendoza",
      caption: "Heisman winner",
      group: "Football",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/2026-0117_Fernando_Mendoza.jpeg/960px-2026-0117_Fernando_Mendoza.jpeg",
      face: { x: 0.50, y: 0.34, rx: 0.14, ry: 0.165 },
      credit: { author: "Bobak Ha'Eri", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:2026-0117_Fernando_Mendoza.jpeg" },
    },
    {
      id: "corso",
      name: "Lee Corso",
      caption: "Not so fast, my friend! (IU coach, 1973-82)",
      group: "Football",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Lee_Corso_September_2014.jpg/960px-Lee_Corso_September_2014.jpg",
      face: { x: 0.63, y: 0.35, rx: 0.155, ry: 0.165 },
      credit: { author: "Kingofthedead", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Lee_Corso_September_2014.jpg" },
    },

    // ---------------------------- MEN'S HOOPS -----------------------------
    {
      id: "devries",
      name: "Darian DeVries",
      caption: "Head coach, arms crossed, judging you",
      group: "Men's Hoops",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/56/Darian_DeVries_in_2023_%28cropped%29.jpg",
      face: { x: 0.44, y: 0.23, rx: 0.15, ry: 0.17 },
      credit: { author: "Dwtsfan123", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Darian_DeVries_in_2023_(cropped).jpg" },
    },
    {
      id: "sherrell",
      name: "Aiden Sherrell",
      caption: "Seven-foot IU big man (pictured at Alabama)",
      group: "Men's Hoops",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Aiden_Sherrell.jpg/960px-Aiden_Sherrell.jpg",
      face: { x: 0.56, y: 0.40, rx: 0.085, ry: 0.07 },
      credit: { author: "MGoBlog", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Aiden_Sherrell.jpg" },
    },
    {
      id: "harris",
      name: "Darren Harris",
      caption: "Press conference face (pictured at Duke)",
      group: "Men's Hoops",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Darren_Harris_-_Duke-TCU_March_2026-1_%28cropped%29.jpg/960px-Darren_Harris_-_Duke-TCU_March_2026-1_%28cropped%29.jpg",
      face: { x: 0.48, y: 0.48, rx: 0.14, ry: 0.22 },
      credit: { author: "NetwonsBucket", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Darren_Harris_-_Duke-TCU_March_2026-1_(cropped).jpg" },
    },
    {
      id: "burton",
      name: "Markus Burton",
      caption: "Mishawaka's own (pictured at Notre Dame)",
      group: "Men's Hoops",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Markus_Burton.jpg/960px-Markus_Burton.jpg",
      face: { x: 0.62, y: 0.345, rx: 0.16, ry: 0.165 },
      credit: { author: "TigerNet.com", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Markus_Burton.jpg" },
    },

    // --------------------------- WOMEN'S HOOPS ----------------------------
    {
      id: "moren",
      name: "Teri Moren",
      caption: "Head coach, crouched and locked in",
      group: "Women's Hoops",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Teri_Moren_03_%28cropped%29.jpg/960px-Teri_Moren_03_%28cropped%29.jpg",
      face: { x: 0.43, y: 0.19, rx: 0.12, ry: 0.10 },
      credit: { author: "Lorie Shaull", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Teri_Moren_03_(cropped).jpg" },
    },
    // No free-to-use photos of these players exist yet. They show a cartoon
    // stand-in until you drop a photo in images/ and set image + face + credit.
    {
      id: "beaumont",
      name: "Lenée Beaumont",
      caption: "Photo needed: cartoon stand-in for now",
      group: "Women's Hoops",
      image: null,
      jersey: "5",
      face: { x: 0.5, y: 0.27, rx: 0.17, ry: 0.16 },
      credit: null,
    },
    {
      id: "hare",
      name: "Kenzie Hare",
      caption: "Photo needed: cartoon stand-in for now",
      group: "Women's Hoops",
      image: null,
      jersey: "22",
      face: { x: 0.5, y: 0.27, rx: 0.17, ry: 0.16 },
      credit: null,
    },
    {
      id: "socka-nguemen",
      name: "Zania Socka-Nguemen",
      caption: "Photo needed: cartoon stand-in for now",
      group: "Women's Hoops",
      image: null,
      jersey: "23",
      face: { x: 0.5, y: 0.27, rx: 0.17, ry: 0.16 },
      credit: null,
    },
    {
      id: "samuels",
      name: "Malia Samuels",
      caption: "Photo needed: cartoon stand-in for now",
      group: "Women's Hoops",
      image: null,
      jersey: "0",
      face: { x: 0.5, y: 0.27, rx: 0.17, ry: 0.16 },
      credit: null,
    },

    // ------------------------------ LEGENDS -------------------------------
    {
      id: "knight",
      name: "Bob Knight",
      caption: "The General. Do not throw a chair.",
      group: "Legends",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Bob-Knight-Nov-21-07-1.jpg/960px-Bob-Knight-Nov-21-07-1.jpg",
      face: { x: 0.53, y: 0.27, rx: 0.16, ry: 0.135 },
      credit: { author: "A1C Jonathan Steffen, U.S. Air Force", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Bob-Knight-Nov-21-07-1.jpg" },
    },
    {
      id: "mccracken",
      name: "Branch McCracken",
      caption: "Two national titles (1940 and 1953)",
      group: "Legends",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Branch_McCracken.jpg",
      face: { x: 0.43, y: 0.34, rx: 0.14, ry: 0.145 },
      credit: { author: "Indiana University", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Branch_McCracken.jpg" },
    },
    {
      id: "isiah",
      name: "Isiah Thomas",
      caption: "1981 national champion",
      group: "Legends",
      image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Isiah_Thomas_2007_%28cropped%29.jpg",
      face: { x: 0.66, y: 0.30, rx: 0.17, ry: 0.17 },
      credit: { author: "Keith Allison", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Isiah_Thomas_2007_(cropped).jpg" },
    },

    // ----------------------------- WILDCARD -------------------------------
    {
      id: "luck",
      name: "Andrew Luck",
      caption: "Stanford coworker",
      group: "Wildcard",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Andrew_Luck_at_2010_Stanford_football_open_house.JPG/960px-Andrew_Luck_at_2010_Stanford_football_open_house.JPG",
      face: { x: 0.54, y: 0.27, rx: 0.15, ry: 0.145 },
      credit: { author: "BrokenSphere", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Andrew_Luck_at_2010_Stanford_football_open_house.JPG" },
    },
  ],
};
