// Lesson data for German Typing Trainer
const LESSONS = [
  // Level 1: Home Row Basics
  { id: 1, name: "Grundstellung", description: "Die Grundstellung der Finger", texts: ["asdf", "jklö", "asdf jklö", "ff jj dd kk ss ll aa öö"] },
  { id: 2, name: "Home Row Mix", description: "Alle Tasten der Grundreihe", texts: ["alfa", "salsa", "falls", "das", "ja", "öl", "all das"] },
  { id: 3, name: "Einfache Wörter", description: "Erste deutsche Wörter", texts: ["das", "als", "ja", "da", "so", "das ja", "als das"] },
  
  // Level 2: Adding more letters
  { id: 4, name: "E und I", description: "Die häufigsten Vokale", texts: ["die", "sie", "wie", "diese", "leise", "diese leise"] },
  { id: 5, name: "R und U", description: "Weitere wichtige Buchstaben", texts: ["der", "und", "nur", "dürfen", "rudert"] },
  { id: 6, name: "N und T", description: "Konsonanten üben", texts: ["nett", "dann", "kann", "Tennis", "tanzen"] },
  
  // Level 3: Common Words
  { id: 7, name: "Häufige Wörter 1", description: "Die häufigsten deutschen Wörter", texts: ["und", "der", "die", "ist", "das", "nicht", "sie"] },
  { id: 8, name: "Häufige Wörter 2", description: "Mehr häufige Wörter", texts: ["auf", "mit", "sich", "auch", "eine", "aber", "nach"] },
  { id: 9, name: "Häufige Wörter 3", description: "Noch mehr Wörter", texts: ["wenn", "sein", "noch", "werden", "haben", "kann"] },
  
  // Level 4: Upper Row
  { id: 10, name: "Obere Reihe Links", description: "Q W E R T", texts: ["wer", "weit", "Tier", "Wetter", "Retter", "Teer"] },
  { id: 11, name: "Obere Reihe Rechts", description: "Z U I O P", texts: ["Zug", "Uhr", "Ohr", "Paar", "Pizza", "Polizei"] },
  { id: 12, name: "Obere Reihe Mix", description: "Alle oberen Tasten", texts: ["Computer", "Papier", "Wort", "Zeitung"] },
  
  // Level 5: Lower Row
  { id: 13, name: "Untere Reihe Links", description: "Y X C V B", texts: ["Box", "Fax", "Cyan", "Verb", "Baby"] },
  { id: 14, name: "Untere Reihe Rechts", description: "N M , . -", texts: ["Mann", "Name", "Nummer", "Moment"] },
  { id: 15, name: "Untere Reihe Mix", description: "Alle unteren Tasten", texts: ["Maximum", "Minimum", "Mixer", "Nexus"] },
  
  // Level 6: German Special Characters
  { id: 16, name: "Umlaute Ä", description: "Der Umlaut Ä", texts: ["Äpfel", "Bäume", "Käse", "Mädchen", "spät"] },
  { id: 17, name: "Umlaute Ö", description: "Der Umlaut Ö", texts: ["schön", "König", "Löwe", "mögen", "Öl"] },
  { id: 18, name: "Umlaute Ü", description: "Der Umlaut Ü", texts: ["über", "grün", "Tür", "für", "Müll", "Frühling"] },
  { id: 19, name: "Eszett ß", description: "Das scharfe S", texts: ["groß", "Straße", "weiß", "Fuß", "Gruß", "süß"] },
  { id: 20, name: "Alle Umlaute", description: "Ä, Ö, Ü und ß gemischt", texts: ["größer", "für Äpfel", "schöne Grüße", "süße Träume"] },
  
  // Level 7: Numbers
  { id: 21, name: "Zahlen 1-5", description: "Die ersten Zahlen", texts: ["1 2 3", "4 5", "12345", "11 22 33 44 55"] },
  { id: 22, name: "Zahlen 6-0", description: "Die restlichen Zahlen", texts: ["6 7 8 9 0", "67890", "66 77 88 99 00"] },
  { id: 23, name: "Zahlen Mix", description: "Alle Zahlen gemischt", texts: ["2024", "12:30", "100", "365 Tage", "24 Stunden"] },
  
  // Level 8: Punctuation
  { id: 24, name: "Punkt und Komma", description: "Grundlegende Satzzeichen", texts: ["Hallo, Welt.", "Ja, genau.", "Eins, zwei, drei."] },
  { id: 25, name: "Frage und Ausruf", description: "? und !", texts: ["Wie geht es?", "Super!", "Was ist das?", "Toll!"] },
  { id: 26, name: "Alle Satzzeichen", description: "Gemischte Satzzeichen", texts: ["Hallo! Wie geht es dir?", "Gut, danke."] },
  
  // Level 9: Short Sentences
  { id: 27, name: "Kurze Sätze 1", description: "Einfache deutsche Sätze", texts: ["Ich bin hier.", "Du bist nett.", "Er hat Zeit."] },
  { id: 28, name: "Kurze Sätze 2", description: "Mehr einfache Sätze", texts: ["Die Sonne scheint.", "Der Hund bellt.", "Die Katze schläft."] },
  { id: 29, name: "Kurze Sätze 3", description: "Alltägliche Sätze", texts: ["Guten Morgen!", "Auf Wiedersehen!", "Danke schön!"] },
  
  // Level 10: Medium Sentences
  { id: 30, name: "Mittlere Sätze 1", description: "Längere Sätze üben", texts: ["Ich gehe heute in die Schule.", "Meine Freundin heißt Anna."] },
  { id: 31, name: "Mittlere Sätze 2", description: "Mehr längere Sätze", texts: ["Das Wetter ist heute sehr schön.", "Wir spielen gerne im Garten."] },
  { id: 32, name: "Mittlere Sätze 3", description: "Alltagssätze", texts: ["Ich esse gerne Pizza und Pasta.", "Mein Lieblingsfach ist Kunst."] },
  
  // Level 11: Speed Training
  { id: 33, name: "Schnelligkeit 1", description: "Kurze Wörter schnell tippen", texts: ["an auf ab um in zu da so ja wo"] },
  { id: 34, name: "Schnelligkeit 2", description: "Mittlere Wörter schnell", texts: ["haben sein werden können müssen"] },
  { id: 35, name: "Schnelligkeit 3", description: "Gemischte Geschwindigkeit", texts: ["Der schnelle braune Fuchs springt."] },
  
  // Level 12: Animal Theme
  { id: 36, name: "Tiere 1", description: "Haustiere", texts: ["Hund Katze Maus", "Hamster Vogel Fisch", "Kaninchen Meerschweinchen"] },
  { id: 37, name: "Tiere 2", description: "Wildtiere", texts: ["Löwe Tiger Bär", "Elefant Giraffe Zebra", "Wolf Fuchs Hase"] },
  { id: 38, name: "Tiere 3", description: "Tiersätze", texts: ["Der Hund bellt laut.", "Die Katze schnurrt leise.", "Der Vogel singt schön."] },
  
  // Level 13: Food Theme
  { id: 39, name: "Essen 1", description: "Obst und Gemüse", texts: ["Apfel Birne Banane", "Tomate Gurke Salat", "Kartoffel Karotte Zwiebel"] },
  { id: 40, name: "Essen 2", description: "Mahlzeiten", texts: ["Frühstück Mittagessen Abendessen", "Brot Käse Wurst", "Suppe Salat Nachtisch"] },
  { id: 41, name: "Essen 3", description: "Essenssätze", texts: ["Ich esse gerne Äpfel.", "Zum Frühstück gibt es Brot.", "Das Mittagessen schmeckt gut."] },
  
  // Level 14: Colors and Shapes
  { id: 42, name: "Farben", description: "Alle Farben", texts: ["rot blau grün gelb", "orange lila rosa braun", "schwarz weiß grau"] },
  { id: 43, name: "Formen", description: "Geometrische Formen", texts: ["Kreis Quadrat Dreieck", "Rechteck Oval Stern", "Herz Raute Pfeil"] },
  { id: 44, name: "Farben und Formen", description: "Kombiniert", texts: ["Der rote Kreis.", "Das blaue Quadrat.", "Das grüne Dreieck."] },
  
  // Level 15: Family
  { id: 45, name: "Familie 1", description: "Familienmitglieder", texts: ["Mama Papa Kind", "Bruder Schwester Baby", "Oma Opa Enkel"] },
  { id: 46, name: "Familie 2", description: "Erweiterte Familie", texts: ["Onkel Tante Cousin", "Cousine Neffe Nichte"] },
  { id: 47, name: "Familie 3", description: "Familiensätze", texts: ["Meine Mama ist toll.", "Ich liebe meine Familie.", "Oma backt leckeren Kuchen."] },
  
  // Level 16: School
  { id: 48, name: "Schule 1", description: "Schulfächer", texts: ["Mathe Deutsch Englisch", "Kunst Sport Musik", "Sachkunde Religion Ethik"] },
  { id: 49, name: "Schule 2", description: "Schulsachen", texts: ["Heft Buch Stift", "Schere Kleber Lineal", "Ranzen Mäppchen Radiergummi"] },
  { id: 50, name: "Schule 3", description: "Schulsätze", texts: ["Ich gehe gerne zur Schule.", "Mathe macht mir Spaß.", "Die Pause ist zu kurz."] },
  
  // Level 17: Seasons and Weather
  { id: 51, name: "Jahreszeiten", description: "Frühling bis Winter", texts: ["Frühling Sommer Herbst Winter", "warm heiß kühl kalt"] },
  { id: 52, name: "Wetter", description: "Wetterwörter", texts: ["Sonne Regen Schnee Wind", "Wolken Gewitter Nebel Eis"] },
  { id: 53, name: "Wetter Sätze", description: "Wettersätze", texts: ["Heute scheint die Sonne.", "Es regnet stark.", "Der Wind weht kräftig."] },
  
  // Level 18: Hobbies
  { id: 54, name: "Hobbys 1", description: "Sport und Spiel", texts: ["Fußball Tennis Schwimmen", "Radfahren Laufen Turnen", "Spielen Basteln Malen"] },
  { id: 55, name: "Hobbys 2", description: "Kreative Hobbys", texts: ["Lesen Schreiben Zeichnen", "Singen Tanzen Musizieren", "Fotografieren Kochen Backen"] },
  { id: 56, name: "Hobbys 3", description: "Hobbysätze", texts: ["Ich spiele gerne Fußball.", "Am liebsten lese ich Bücher.", "Schwimmen macht mir Spaß."] },
  
  // Level 19: Days and Months
  { id: 57, name: "Wochentage", description: "Montag bis Sonntag", texts: ["Montag Dienstag Mittwoch", "Donnerstag Freitag", "Samstag Sonntag"] },
  { id: 58, name: "Monate 1", description: "Januar bis Juni", texts: ["Januar Februar März", "April Mai Juni"] },
  { id: 59, name: "Monate 2", description: "Juli bis Dezember", texts: ["Juli August September", "Oktober November Dezember"] },
  
  // Level 20: Advanced Sentences
  { id: 60, name: "Lange Sätze 1", description: "Komplexere Sätze", texts: ["Wenn die Sonne scheint, gehen wir in den Park spielen."] },
  { id: 61, name: "Lange Sätze 2", description: "Mehr komplexe Sätze", texts: ["Meine beste Freundin und ich treffen uns jeden Tag nach der Schule."] },
  { id: 62, name: "Lange Sätze 3", description: "Fortgeschrittene Sätze", texts: ["Am Wochenende besuchen wir oft unsere Großeltern auf dem Land."] },
  
  // Level 21: Stories
  { id: 63, name: "Geschichte 1", description: "Kurze Geschichte Teil 1", texts: ["Es war einmal ein kleines Mädchen.", "Sie lebte in einem Haus am Waldrand."] },
  { id: 64, name: "Geschichte 2", description: "Kurze Geschichte Teil 2", texts: ["Eines Tages fand sie einen kleinen Hund.", "Der Hund wurde ihr bester Freund."] },
  { id: 65, name: "Geschichte 3", description: "Kurze Geschichte Teil 3", texts: ["Zusammen erlebten sie viele Abenteuer.", "Und sie lebten glücklich bis ans Ende ihrer Tage."] },
  
  // Level 22: Tongue Twisters (simplified)
  { id: 66, name: "Zungenbrecher 1", description: "Einfache Zungenbrecher", texts: ["Fischers Fritz fischt frische Fische."] },
  { id: 67, name: "Zungenbrecher 2", description: "Mehr Zungenbrecher", texts: ["Blaukraut bleibt Blaukraut und Brautkleid bleibt Brautkleid."] },
  { id: 68, name: "Zungenbrecher 3", description: "Schwierige Zungenbrecher", texts: ["Zwischen zwei Zwetschgenzweigen zwitschern zwei Schwalben."] },
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
