function toggleMenu() {
  const menu = document.getElementById("navMenu");

  if (menu) {
    menu.classList.toggle("open");
  }
}


/*
  LOCAL DEMO STATUS SYSTEM

  Ez jelenleg a böngésző LocalStorage rendszerét használja.
  Így ezen az eszközön megmaradnak az adatok.

  Később ezt kötjük össze backenddel,
  hogy minden látogatónál ugyanaz jelenjen meg.
*/


const defaultData = {
  discord: {
    text: "NYITVA",
    color: "green"
  },

  game: {
    text: "FEJLESZTÉS ALATT",
    color: "orange"
  },

  announcement: null
};


function loadData() {

  const saved =
    localStorage.getItem("RA_V4_DATA");

  if (!saved) {
    return defaultData;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return defaultData;
  }
}


function applyStatus(elementId, dotId, status) {

  const element =
    document.getElementById(elementId);

  const dot =
    document.getElementById(dotId);

  if (!element || !dot) return;

  element.textContent = status.text;

  dot.className =
    "status-dot " + status.color;
}


function showAnnouncement(data) {

  const section =
    document.getElementById("announcementSection");

  const text =
    document.getElementById("announcementText");

  const time =
    document.getElementById("announcementTime");

  if (!section || !text || !time) return;


  if (!data.announcement) {

    section.classList.add("hidden");

    return;
  }


  const created =
    new Date(data.announcement.created);

  const expires =
    created.getTime() +
    (24 * 60 * 60 * 1000);


  if (Date.now() >= expires) {

    data.announcement = null;

    localStorage.setItem(
      "RA_V4_DATA",
      JSON.stringify(data)
    );

    section.classList.add("hidden");

    return;
  }


  section.classList.remove("hidden");

  text.textContent =
    data.announcement.text;

  time.textContent =
    "Közzétéve: " +
    created.toLocaleString("hu-HU");
}


function initializeSite() {

  const data = loadData();

  applyStatus(
    "discordStatus",
    "discordDot",
    data.discord
  );

  applyStatus(
    "gameStatus",
    "gameDot",
    data.game
  );

  showAnnouncement(data);
}


initializeSite();


/*
  A lap 30 másodpercenként ellenőrzi,
  hogy lejárt-e a 24 órás bejelentés.
*/

setInterval(() => {

  const data = loadData();

  showAnnouncement(data);

}, 30000);
