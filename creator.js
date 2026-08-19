/*
  FONTOS!

  Ez egy GitHub Pages FRONTEND DEMO.

  Valódi jelszavakat nem tárolunk ebben
  a fájlban, mert a GitHub repository
  nyilvános.

  A Creator kód helyett egy ideiglenes
  demo kódot használunk.

  Később valódi backenddel cseréljük le.
*/


const DEMO_CREATOR_CODE =
  "RA_V4_DEMO_2026";


const creators = {

  darkangel: {
    name: "Dark Angel",
    username: "szilike138",
    rank: "Al tulaj"
  },

  arab: {
    name: "Arab",
    username: "Arab998",
    rank: "Tulajdonos"
  },

  developer: {
    name: "imokaywsggg",
    username: "zeti6272",
    rank: "Fejlesztő"
  }

};


let currentCreator = null;


/* LOGIN */

function checkCreatorCode() {

  const input =
    document.getElementById("creatorCode");

  const error =
    document.getElementById("loginError");

  const code =
    input.value.trim();


  if (code !== DEMO_CREATOR_CODE) {

    error.textContent =
      "Hibás creator kód.";

    return;
  }


  error.textContent = "";

  showCreatorPanel();
}


/*
  DEMO CREATOR SELECTION

  Mivel valódi jelszót nem teszünk
  nyilvános JS-be, a demo jelenleg
  kiválasztja a bemutató fiókot.
*/


function showCreatorPanel() {

  const selected =
    prompt(
      "Demo mód:\n\n" +
      "1 = Dark Angel\n" +
      "2 = Arab\n" +
      "3 = imokaywsggg\n\n" +
      "Írd be a számot:"
    );


  if (selected === "1") {

    currentCreator =
      creators.darkangel;

  } else if (selected === "2") {

    currentCreator =
      creators.arab;

  } else if (selected === "3") {

    currentCreator =
      creators.developer;

  } else {

    document.getElementById(
      "loginError"
    ).textContent =
      "Érvénytelen választás.";

    return;
  }


  document
    .getElementById("loginPage")
    .classList.add("hidden");


  document
    .getElementById("panelPage")
    .classList.remove("hidden");


  document
    .getElementById("currentUser")
    .textContent =
      currentCreator.name +
      " — " +
      currentCreator.rank;


  document
    .getElementById("welcomeText")
    .textContent =
      "Üdvözöljük " +
      currentCreator.name +
      " (" +
      currentCreator.rank +
      ") a creator szerveren";


  loadPanelData();
}


/* STATUS */

function loadPanelData() {

  const data =
    getData();


  setSelectValue(
    "discordSelect",
    data.discord
  );

  setSelectValue(
    "gameSelect",
    data.game
  );

  if (data.announcement) {

    document
      .getElementById(
        "announcementInput"
      )
      .value =
        data.announcement.text;
  }


  renderChat();
}


function setSelectValue(
  id,
  status
) {

  const select =
    document.getElementById(id);

  if (!select) return;


  const wanted =
    status.color +
    "|" +
    status.text;


  for (const option of select.options) {

    if (option.value === wanted) {

      select.value =
        wanted;

      break;
    }

  }
}


/* SAVE STATUS */

function saveStatus() {

  const data =
    getData();


  const discord =
    document
      .getElementById("discordSelect")
      .value
      .split("|");


  const game =
    document
      .getElementById("gameSelect")
      .value
      .split("|");


  data.discord = {

    color: discord[0],
    text: discord.slice(1).join("|")

  };


  data.game = {

    color: game[0],
    text: game.slice(1).join("|")

  };


  saveData(data);


  document
    .getElementById("statusMessage")
    .textContent =
      "✓ Status sikeresen mentve.";
}


/* ANNOUNCEMENT */

function publishAnnouncement() {

  const input =
    document.getElementById(
      "announcementInput"
    );


  const text =
    input.value.trim();


  if (!text) {

    document
      .getElementById(
        "announcementMessage"
      )
      .textContent =
        "Írj be egy bejelentést.";

    return;
  }


  const data =
    getData();


  if (data.announcement) {

    document
      .getElementById(
        "announcementMessage"
      )
      .textContent =
        "Jelenleg ki van írva egy bejelentés 24 óráig. Próbáld meg később.";

    return;
  }


  data.announcement = {

    text: text,

    created:
      new Date().toISOString(),

    creator:
      currentCreator.name

  };


  saveData(data);


  document
    .getElementById(
      "announcementMessage"
    )
    .textContent =
      "✓ A bejelentés közzétéve 24 órára.";
}


/* REMOVE */

function removeAnnouncement() {

  const data =
    getData();


  data.announcement =
    null;


  saveData(data);


  document
    .getElementById(
      "announcementMessage"
    )
    .textContent =
      "✓ Aktív bejelentés törölve.";
}


/* CHAT */

function sendMessage() {

  const input =
    document.getElementById(
      "chatInput"
    );


  const text =
    input.value.trim();


  if (!text) return;


  const data =
    getData();


  if (!data.chat) {

    data.chat = [];

  }


  data.chat.push({

    user:
      currentCreator.name,

    rank:
      currentCreator.rank,

    text:
      text,

    time:
      new Date().toISOString()

  });


  saveData(data);


  input.value = "";

  renderChat();
}


function renderChat() {

  const container =
    document.getElementById(
      "chatMessages"
    );


  if (!container) return;


  const data =
    getData();


  if (!data.chat || data.chat.length === 0) {

    container.innerHTML =
      '<div class="chat-empty">' +
      'A chat jelenleg üres.' +
      '</div>';

    return;
  }


  container.innerHTML =
    "";


  data.chat.forEach(message => {

    const div =
      document.createElement("div");


    div.className =
      "chat-message";


    const time =
      new Date(message.time)
        .toLocaleString("hu-HU");


    div.innerHTML =
      "<strong>" +
      escapeHtml(message.user) +
      "</strong> " +
      "<small>" +
      escapeHtml(message.rank) +
      " • " +
      escapeHtml(time) +
      "</small>" +
      "<div>" +
      escapeHtml(message.text) +
      "</div>";


    container.appendChild(div);

  });
}


/* DATA */

function getData() {

  const saved =
    localStorage.getItem(
      "RA_V4_DATA"
    );


  if (!saved) {

    return {

      discord: {
        color: "green",
        text: "NYITVA"
      },

      game: {
        color: "orange",
        text: "FEJLESZTÉS ALATT"
      },

      announcement: null,

      chat: []

    };

  }


  try {

    const data =
      JSON.parse(saved);


    if (!data.chat) {
      data.chat = [];
    }


    return data;

  } catch {

    return {

      discord: {
        color: "green",
        text: "NYITVA"
      },

      game: {
        color: "orange",
        text: "FEJLESZTÉS ALATT"
      },

      announcement: null,

      chat: []

    };

  }
}


function saveData(data) {

  localStorage.setItem(
    "RA_V4_DATA",
    JSON.stringify(data)
  );

}


/* SECURITY FOR CHAT DISPLAY */

function escapeHtml(value) {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");
}


/* BACK */

function goHome() {

  window.location.href =
    "index.html";

    }
