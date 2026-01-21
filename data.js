// Lesson data for German Typing Trainer
// Revised to ensure:
// 1. Text lines >= 10 chars
// 2. Strict cumulative key introduction

const LESSONS = [
  // Stage 1: The Foundation (Home Row) is f, j, d, k, s, l, a, ö
  { 
      id: 1, 
      name: "Zeigefinger", 
      description: "F und J - Die Anker", 
      texts: [
          "ffff jjjj ffjj jjff", 
          "jfjf jfjf fjfj jfjf", 
          "ff jj ff jj ff jj", 
          "fjjf jffj fjjf jffj"
      ] 
  },
  { 
      id: 2, 
      name: "Mittelfinger", 
      description: "D und K", 
      texts: [
          "ddkk ddkk ddkk ddkk", 
          "kdfj fjdk kdjk djkd", 
          "dkdk fkjd kdfj dffk", 
          "ddff kkjj ddkk ffjj"
      ] 
  },
  { 
      id: 3, 
      name: "Ringfinger", 
      description: "S und L", 
      texts: [
          "ssll ssll ssll ssll", 
          "sdfj jkld fjsl dksl", 
          "slsl kdkd fjfj slsl", 
          "lskd fjsl lskd fjsl"
      ] 
  },
  { 
      id: 4, 
      name: "Kleiner Finger", 
      description: "A und Ö", 
      texts: [
          "aaöö aaöö aaöö aaöö", 
          "asdf jklö asdf jklö", 
          "öaöa lksj öaöa lksj", 
          "asdfjklö ölkjfdsa aa"
      ] 
  },
  { 
      id: 5, 
      name: "Grundstellung", 
      description: "Alle Tasten der Grundreihe", 
      texts: [
          "asdf jklö asdf jklö", 
          "das fass das fass da", 
          "alsa lada alsa lada", 
          "lass das all da lass", 
          "falls all da falls"
      ] 
  },

  // Stage 2: Reaching In & Up -> G, H, E, I
  { 
      id: 6, 
      name: "Zeigefinger Mitte", 
      description: "G und H", 
      texts: [
          "fgh jhg ggh hhg fghj", 
          "gas gas gas gas gas", 
          "hals hals hals hals", 
          "jag jag jag ja jag", 
          "flagge flagge flagge"
      ] 
  },
  { 
      id: 7, 
      name: "Mittelfinger Oben", 
      description: "E und I", 
      texts: [
          "die sie die sie das", 
          "eil eis eil eis elf", 
          "feige feige feige", 
          "seide heide seide", 
          "lies das kleid lies"
      ] 
  },
  { 
      id: 8, 
      name: "G H E I Mix", 
      description: "Neue Tasten üben", 
      texts: [
          "geh sieg geh sieg", 
          "feig heilig feig", 
          "die lage die lage", 
          "das gleis das gleis", 
          "leis und hell leis"
      ] 
  },
  { 
      id: 9, 
      name: "Wörter Stage 2", 
      description: "Wörter üben", 
      texts: [
          "igel hasse igel", 
          "gleis sieg gleis", 
          "kiesel glas kiesel", 
          "fliege heil fliege",
          "feger jagd feger"
      ] 
  },
  { 
      id: 10, 
      name: "Stage 2 Review", 
      description: "Sätze bilden", 
      texts: [
          "sie liest das", 
          "es ist heiss es ist", 
          "das glas fiel das", 
          "die flagge fiel", 
          "lies das lied lies"
      ] 
  },

  // Stage 3: Upper Row Expansion -> R, U, T, Z
  { 
      id: 11, 
      name: "Zeigefinger Oben", 
      description: "R und U", 
      texts: [
          "fruf juj rur uju fr", 
          "ruhe im saal ruhe", 
          "auf der flur auf", 
          "kurse rufen kurse", 
          "rauh frau rauh frau"
      ] 
  },
  { 
      id: 12, 
      name: "Zeigefinger Weit", 
      description: "T und Z", 
      texts: [
          "ftfz jzjt tzt ztz", 
          "kurze zeit kurze", 
          "arzt zur tat arzt", 
          "jetzt zur tat jetzt", 
          "zartes ziel zartes",
          "katze tatze katze"
      ] 
  },
  { 
      id: 13, 
      name: "R/U Übung", 
      description: "Wörter mit R und U", 
      texts: [
          "raus ruhe raus ruhe", 
          "grau treu grau treu", 
          "traurig urru traurig",
          "auge rad auge rad"
      ] 
  },
  { 
      id: 14, 
      name: "T/Z Übung", 
      description: "Wörter mit T und Z", 
      texts: [
          "zitat arzt zitat", 
          "tatz zitz tatz zitz", 
          "katze jetzt katze", 
          "ziel zeit ziel zeit"
      ] 
  },
  { 
      id: 15, 
      name: "Stage 3 Review", 
      description: "Obere Reihe Mix", 
      texts: [
          "zur tat zur tat", 
          "gute reise gute", 
          "harte zeit harte", 
          "rote rose rote", 
          "kurze rats tage"
      ] 
  },

  // Stage 4: Upper Row Edge -> W, O, Q, P
  { 
      id: 16, 
      name: "Ringfinger Oben", 
      description: "W und O", 
      texts: [
          "sws lol wowo swslol", 
          "wo ist das wo ist", 
          "sowieso sowieso", 
          "wolle und lose wolle", 
          "wort ort tor rot"
      ] 
  },
  { 
      id: 17, 
      name: "Kleiner Finger Oben", 
      description: "Q und P", 
      texts: [
          "aqa öpö ququ aqaöpö", 
          "papa passt auf papa", 
          "quelle im park quelle", 
          "quer per post quer", 
          "opa oper opa oper"
      ] 
  },
  { 
      id: 18, 
      name: "W/O Übung", 
      description: "Wörter mit W und O", 
      texts: [
          "worte wie gold", 
          "sowie wo wo sowie", 
          "wieso ober wieso", 
          "oder oder oder oder"
      ] 
  },
  { 
      id: 19, 
      name: "Q/P Übung", 
      description: "Wörter mit Q und P", 
      texts: [
          "post oper post oper", 
          "qual quatsch qual", 
          "papa aqua papa aqua", 
          "quer pass quer"
      ] 
  },
  { 
      id: 20, 
      name: "Stage 4 Review", 
      description: "Obere Reihe Komplett", 
      texts: [
          "wer war wo wer war", 
          "wo ist walter wo", 
          "opa isst obst opa", 
          "post für paul post", 
          "quelle der ruhe"
      ] 
  },

  // Stage 5: Lower Row Descent -> V, B, N, M
  { 
      id: 21, 
      name: "Zeigefinger Unten L", 
      description: "V und B (Index L)", 
      texts: [
          "fvf fbf vb vfv fbf", 
          "vater ball vater ball", 
          "brav aber wo brav", 
          "bevor aber bevor", 
          "vava baba vava baba"
      ] 
  },
  { 
      id: 22, 
      name: "Zeigefinger Unten R", 
      description: "N und M (Index R)", 
      texts: [
          "jnj jmj nm jnm jmj", 
          "mann im mond mann", 
          "nein und nie nein", 
          "wann und wo wann", 
          "mama mag nana mama"
      ] 
  },
  { 
      id: 23, 
      name: "V/B Übung", 
      description: "Linke Hand unten", 
      texts: [
          "vaber biber vaber", 
          "verb brave verb", 
          "vava baba vava", 
          "bevor wir aber"
      ] 
  },
  { 
      id: 24, 
      name: "N/M Übung", 
      description: "Rechte Hand unten", 
      texts: [
          "mama nonne mama", 
          "mund mann mund", 
          "immer wenn immer", 
          "nein nie nein nie"
      ] 
  },
  { 
      id: 25, 
      name: "Stage 5 Review", 
      description: "Untere Reihe Mitte", 
      texts: [
          "baum vor haus baum", 
          "mann im mond mann", 
          "braun und blau", 
          "blume im garten", 
          "neben dem baum"
      ] 
  },

  // Stage 6: Lower Row Edge -> C, X, Y
  { 
      id: 26, 
      name: "Mittelfinger Unten", 
      description: "C", 
      texts: [
          "dcd ccc dc dcd ccc", 
          "circa cafe circa", 
          "clown im camp clown", 
          "computer code pc", 
          "chef im chor chef"
      ] 
  },
  { 
      id: 27, 
      name: "Ringfinger Unten", 
      description: "X", 
      texts: [
          "sxs xxx sx sxs xxx", 
          "axe text axe text", 
          "extra taxi extra", 
          "haxe und box haxe", 
          "alex im taxi alex"
      ] 
  },
  { 
      id: 28, 
      name: "Kleiner Finger Unten", 
      description: "Y", 
      texts: [
          "aya yyy ay aya yyy", 
          "yacht yoga yacht", 
          "baby lady baby lady", 
          "okay okay okay okay", 
          "typ system typ"
      ] 
  },
  { 
      id: 29, 
      name: "C X Y Mix", 
      description: "Untere Reihe Aussen", 
      texts: [
          "taxi zur city taxi", 
          "bayern extra bayern", 
          "yoga im club yoga", 
          "text code text code"
      ] 
  },
  { 
      id: 30, 
      name: "Stage 6 Review", 
      description: "Untere Reihe Komplett", 
      texts: [
          "cyborg matrix cyborg", 
          "bayern extra bayern", 
          "yeti im taxi yeti", 
          "city yoga city yoga"
      ] 
  },

  // Stage 7: Capitalization -> Shift
  { 
      id: 31, 
      name: "Shift Links", 
      description: "Großbuchstaben Rechts", 
      texts: [
          "Lisa Paul Hans Udo", 
          "Tom Ida Oma Opa Im", 
          "Nur Mut Nur Mut", 
          "Hans im Glück Hans"
      ] 
  },
  { 
      id: 32, 
      name: "Shift Rechts", 
      description: "Großbuchstaben Links", 
      texts: [
          "Affe Esel Qantas Wer", 
          "Werder Vater Xaver", 
          "Das Auto Die Bahn", 
          "Er ist da Er ist da"
      ] 
  },
  { 
      id: 33, 
      name: "Nomen 1", 
      description: "Einfache Nomen", 
      texts: [
          "Der Tisch Das Haus", 
          "Die Uhr Ein Auto", 
          "Das Boot Im See", 
          "Eine Maus im Haus"
      ] 
  },
  { 
      id: 34, 
      name: "Nomen 2", 
      description: "Längere Nomen", 
      texts: [
          "Die Zeitung hier", 
          "Der Computer dort", 
          "Das Telefon klingelt", 
          "Die Lampe leuchtet"
      ] 
  },
  { 
      id: 35, 
      name: "Stage 7 Review", 
      description: "Sätze mit Nomen", 
      texts: [
          "Peter geht nach Hause.", 
          "Susi singt ein Lied.", 
          "Der Tag ist schön.", 
          "Wir gehen in den Zoo."
      ] 
  },

  // Stage 8: German Character Set -> Ä, Ö, Ü, ß
  { 
      id: 36, 
      name: "Umlaut Ä", 
      description: "Ä", 
      texts: [
          "äpfel spät käse spät", 
          "mähen bäcker nähe", 
          "kämmen bänder kämmen", 
          "zähne gäste zähne"
      ] 
  },
  { 
      id: 37, 
      name: "Umlaut Ö", 
      description: "Ö", 
      texts: [
          "öl schön löwe öl schön", 
          "möwe köln böse möwe", 
          "könig söne könig söhne", 
          "löcher möbel löcher"
      ] 
  },
  { 
      id: 38, 
      name: "Umlaut Ü", 
      description: "Ü", 
      texts: [
          "über grün tür über", 
          "mühe kühl süß mühe", 
          "kühe wüste kühe", 
          "üben üben üben üben"
      ] 
  },
  { 
      id: 39, 
      name: "Eszett ß", 
      description: "ß", 
      texts: [
          "groß fuß süß groß", 
          "weiß maß fleiß weiß", 
          "straße spaß straße", 
          "grüße füße grüße"
      ] 
  },
  { 
      id: 40, 
      name: "Stage 8 Review", 
      description: "Deutsche Sonderzeichen", 
      texts: [
          "süße äpfel essen", 
          "schöne grüße senden", 
          "große füße haben", 
          "spätes glück für alle"
      ] 
  },

  // Stage 9: Punctuation & Numbers -> . , ? ! 1-0
  { 
      id: 41, 
      name: "Satzzeichen 1", 
      description: ". und ,", 
      texts: [
          "a, b, c. d, e, f.", 
          "ja, nein, vielleicht.", 
          "eins, zwei, drei.", 
          "er kam, sah, siegte."
      ] 
  },
  { 
      id: 42, 
      name: "Satzzeichen 2", 
      description: "? und !", 
      texts: [
          "Wer bist du denn?", 
          "Ich bin es doch!", 
          "Warum machst du das?", 
          "Darum ist es so!", 
          "Komm sofort her!"
      ] 
  },
  { id: 43, name: "Zahlen 1-5", description: "1 2 3 4 5", texts: ["123 45 123 45 123", "1 2 3 4 5 1 2 3", "142 531 142 531", "24 24 24 24 24"] },
  { id: 44, name: "Zahlen 6-0", description: "6 7 8 9 0", texts: ["678 90 678 90 678", "6 7 8 9 0 6 7 8", "1990 806 1990 806", "79 79 79 79 79"] },
  { id: 45, name: "Stage 9 Review", description: "Gemischte Zeichen", texts: ["Am 1. Mai ist frei!", "100% gut, oder?", "3, 2, 1, los gehts!", "0800-RUF-MICH an"] },

  // Stage 10: Mastery
  { id: 46, name: "Tempo 1", description: "Kurze Wörter", texts: ["und ist der die das in zu den von mit auf", "ein eine eines einem einer"] },
  { id: 47, name: "Tempo 2", description: "Sätze fliessend", texts: ["Der schnelle Fuchs springt.", "Das laute Kind singt.", "Tippen macht viel Spaß."] },
  { id: 48, name: "Ausdauer", description: "Längere Texte", texts: ["Es war einmal ein kleines Haus am Waldrand, in dem eine alte Frau wohnte und lebte."] },
  { id: 49, name: "Komplexität", description: "Schwierige Wörter", texts: ["Rhythmus, Physik, Gymnasium.", "Xylophon und Quellcode.", "Typographie und Psychologie."] },
  { id: 50, name: "Meisterprüfung", description: "Die letzte Hürde", texts: ["Herzlichen Glückwunsch zum Abschluss!", "Du bist nun ein echter Profi.", "Mach weiter so und übe fleißig!"] }
];

// German titles unlocked every 5 levels
const TITLES = {
  1: "Anfänger",
  5: "Tasten-Neuling",
  10: "Buchstaben-Jäger",
  15: "Wort-Entdecker",
  20: "Satz-Baumeister",
  25: "Schnell-Tipper",
  30: "Tempo-Meister",
  35: "Finger-Akrobat",
  40: "Tastatur-Künstler",
  45: "Schreib-Talent",
  50: "Tipp-Profi",
  55: "Blitz-Schreiber",
  60: "Tastatur-Held",
  65: "Meister-Tipper",
  70: "Schreib-Virtuose",
  75: "Finger-Zauberer",
  80: "Tipp-Champion",
  85: "Tastatur-Ninja",
  90: "Schreib-Genie",
  95: "Fast-Legende",
  100: "Tipp-Legende"
};

// Assign target speeds based on stages (5 lessons per stage)
const TARGET_SPEEDS = [25, 28, 31, 33, 36, 39, 42, 44, 47, 50];
LESSONS.forEach(lesson => {
    // Stage logic matches script.js: 1-5=Stage 0, 6-10=Stage 1, etc.
    const stageIndex = Math.floor((lesson.id - 1) / 5);
    const target = TARGET_SPEEDS[Math.min(stageIndex, TARGET_SPEEDS.length - 1)];
    lesson.targetSpeed = target;
});
