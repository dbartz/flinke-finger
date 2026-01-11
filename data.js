// Lesson data for German Typing Trainer
const LESSONS = [
  // Stage 1: The Foundation (Home Row)
  { id: 1, name: "Zeigefinger", description: "F und J - Die Anker", texts: ["fff jjj fj fj jf", "f j f j", "fjfj jfjf", "ja ja", "je je"] },
  { id: 2, name: "Mittelfinger", description: "D und K", texts: ["ddd kkk dk kd", "fjdk", "kdkd dkdk", "da da", "ka ka"] },
  { id: 3, name: "Ringfinger", description: "S und L", texts: ["sss lll sl ls", "asl", "lsls slsl", "das das", "las las"] },
  { id: 4, name: "Kleiner Finger", description: "A und Ö", texts: ["aaa ööö aö öa", "asdf jklö", "öaöa aöaö", "sass soss", "löss"] },
  { id: 5, name: "Grundstellung", description: "Alle Tasten der Grundreihe", texts: ["asdf jklö", "das fass", "ja da", "ödes kaff", "als das ja"] },

  // Stage 2: Reaching In & Up
  { id: 6, name: "Zeigefinger Mitte", description: "G und H", texts: ["fgh jhg ggh hhg", "gas", "hass", "jag", "hage", "glas"] },
  { id: 7, name: "Mittelfinger Oben", description: "E und I", texts: ["ded kik ele isi", "die", "sie", "kiel", "eis", "dein"] },
  { id: 8, name: "G H E I Mix", description: "Neue Tasten üben", texts: ["geh", "hege", "ige", "gige", "sieht", "geht", "heil"] },
  { id: 9, name: "Wörter Stage 2", description: "Wörter üben", texts: ["hase", "igel", "feger", "jagd", "gleis", "jeden", "feig"] },
  { id: 10, name: "Stage 2 Review", description: "Sätze bilden", texts: ["sie jagt", "er geht", "das ei", "dieses glas", "helles licht"] },

  // Stage 3: Upper Row Expansion
  { id: 11, name: "Zeigefinger Oben", description: "R und U", texts: ["frf juj rur uju", "ruf", "nur", "ur", "rad", "rau", "ufer"] },
  { id: 12, name: "Zeigefinger Weit", description: "T und Z", texts: ["ftf jzj tzt ztz", "tat", "zart", "zeit", "ziel", "tatz"] },
  { id: 13, name: "R/U Übung", description: "Wörter mit R und U", texts: ["raus", "ruhe", "grau", "treu", "traurig", "urru"] },
  { id: 14, name: "T/Z Übung", description: "Wörter mit T und Z", texts: ["ztat", "arzt", "taz", "zitz", "katze", "jetzt"] },
  { id: 15, name: "Stage 3 Review", description: "Obere Reihe Mix", texts: ["zur tat", "gute reise", "harte zeit", "rote rose", "kurze rast"] },

  // Stage 4: Upper Row Edge
  { id: 16, name: "Ringfinger Oben", description: "W und O", texts: ["sws lol wowo", "wo", "sowieso", "wow", "wolle", "lose"] },
  { id: 17, name: "Kleiner Finger Oben", description: "Q und P", texts: ["aqa öpö ququ", "pass", "quelle", "paqa", "post", "quer"] },
  { id: 18, name: "W/O Übung", description: "Wörter mit W und O", texts: ["worte", "sowie", "wo wo", "wieso", "ober", "oder"] },
  { id: 19, name: "Q/P Übung", description: "Wörter mit Q und P", texts: ["post", "oper", "qual", "quatsch", "papa", "aqua"] },
  { id: 20, name: "Stage 4 Review", description: "Obere Reihe Komplett", texts: ["power", "quote", "report", "zweck", "profi quiz"] },

  // Stage 5: Lower Row Descent
  { id: 21, name: "Zeigefinger Unten L", description: "V und B (Index L)", texts: ["fvf fbf vb vfv", "verb", "brav", "bevor", "vater", "ball"] },
  { id: 22, name: "Zeigefinger Unten R", description: "N und M (Index R)", texts: ["jnj jmj nm jnm", "mann", "name", "nun", "mama", "nein"] },
  { id: 23, name: "V/B Übung", description: "Linke Hand unten", texts: ["vaber", "biber", "verb", "brave", "vava", "baba"] },
  { id: 24, name: "N/M Übung", description: "Rechte Hand unten", texts: ["mama", "nonne", "mund", "mann", "nana", "momo"] },
  { id: 25, name: "Stage 5 Review", description: "Untere Reihe Mitte", texts: ["baum", "vormann", "manieren", "braun", "novum", "bombe"] },

  // Stage 6: Lower Row Edge
  { id: 26, name: "Mittelfinger Unten", description: "C", texts: ["dcd ccc dc", "circa", "café", "clown", "camp", "clip"] },
  { id: 27, name: "Ringfinger Unten", description: "X", texts: ["sxs xxx sx", "axe", "text", "extra", "haxe", "taxi"] },
  { id: 28, name: "Kleiner Finger Unten", description: "Y", texts: ["aya yyy ay", "yacht", "yoga", "baby", "lady", "okay"] },
  { id: 29, name: "C X Y Mix", description: "Untere Reihe Aussen", texts: ["taxi", "cyano", "x-ray", "bayer", "city", "lynx"] },
  { id: 30, name: "Stage 6 Review", description: "Untere Reihe Komplett", texts: ["cyborg", "matrix", "bayern", "xcopy", "yeti club"] },

  // Stage 7: Capitalization
  { id: 31, name: "Shift Links", description: "Großbuchstaben Rechts", texts: ["Lisa", "Paul", "Hans", "Udo", "Tom", "Ida", "Oma"] },
  { id: 32, name: "Shift Rechts", description: "Großbuchstaben Links", texts: ["Affe", "Esel", "Qantas", "Werder", "Vater", "Xaver"] },
  { id: 33, name: "Nomen 1", description: "Einfache Nomen", texts: ["Der Tisch", "Das Haus", "Die Uhr", "Ein Auto", "Das Boot"] },
  { id: 34, name: "Nomen 2", description: "Längere Nomen", texts: ["Die Zeitung", "Der Computer", "Das Telefon", "Die Lampe"] },
  { id: 35, name: "Stage 7 Review", description: "Sätze mit Nomen", texts: ["Peter geht nach Hause.", "Susi singt ein Lied.", "Der Tag ist schön."] },

  // Stage 8: German Character Set
  { id: 36, name: "Umlaut Ä", description: "Ä", texts: ["äpfel", "spät", "käse", "mähen", "bäcker", "nähe"] },
  { id: 37, name: "Umlaut Ö", description: "Ö", texts: ["öl", "schön", "löwe", "möwe", "köln", "böse"] },
  { id: 38, name: "Umlaut Ü", description: "Ü", texts: ["über", "grün", "tür", "mühe", "kühl", "süß"] },
  { id: 39, name: "Eszett ß", description: "ß", texts: ["groß", "fuß", "süß", "weiß", "maß", "fleiß"] },
  { id: 40, name: "Stage 8 Review", description: "Deutsche Sonderzeichen", texts: ["süße äpfel", "schöne grüße", "große füße", "spätes glück"] },

  // Stage 9: Punctuation & Numbers
  { id: 41, name: "Satzzeichen 1", description: ". und ,", texts: ["a, b, c.", "ja, nein.", "eins, zwei.", "er kam, sah, siegte."] },
  { id: 42, name: "Satzzeichen 2", description: "? und !", texts: ["Wer?", "Ich!", "Warum?", "Darum!", "Komm her!"] },
  { id: 43, name: "Zahlen 1-5", description: "1 2 3 4 5", texts: ["123", "45", "1 2 3", "142", "531", "24"] },
  { id: 44, name: "Zahlen 6-0", description: "6 7 8 9 0", texts: ["678", "90", "6 7 8", "1990", "806", "79"] },
  { id: 45, name: "Stage 9 Review", description: "Gemischte Zeichen", texts: ["Am 1. Mai!", "100% gut.", "3, 2, 1, los!", "0800-RUF-MICH"] },

  // Stage 10: Mastery
  { id: 46, name: "Tempo 1", description: "Kurze Wörter", texts: ["und ist der die das in zu den von mit auf"] },
  { id: 47, name: "Tempo 2", description: "Sätze fliessend", texts: ["Der schnelle Fuchs.", "Das laute Kind.", "Tippen macht Spaß."] },
  { id: 48, name: "Ausdauer", description: "Längere Texte", texts: ["Es war einmal ein kleines Haus am Waldrand, in dem eine alte Frau wohnte."] },
  { id: 49, name: "Komplexität", description: "Schwierige Wörter", texts: ["Rhythmus", "Physik", "Gymnasium", "Xylophon", "Quellcode"] },
  { id: 50, name: "Meisterprüfung", description: "Die letzte Hürde", texts: ["Herzlichen Glückwunsch zum Abschluss!", "Du bist nun ein Profi.", "Mach weiter so!"] }
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
