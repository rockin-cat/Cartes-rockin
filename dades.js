/* =====================================================================
   DADES DE LES CARTES ROCKIN — versió "llegible per la màquina"
   ---------------------------------------------------------------------
   Cada carta té la seva imatge (com a l'app de cartes) i, a més, una
   descripció del que hi ha dibuixat perquè l'app de Creació la pugui
   fer sonar.

   · Cartes rítmiques (Binari / Ternari):
       notes: llista de [inici, durada] en NEGRES des de l'inici del compàs.
       Binari = compàs de 4 negres · Ternari = compàs de 3 negres.
       Exemple: negra, negra, silenci, negra  →  [[0,1],[1,1],[3,1]]
       Les corxeres duren 0.5, les semicorxeres 0.25, els tresets 1/3.

   · Cartes melòdiques: vegeu MELODIC més avall (contorn → notes de l'acord).

   · Cartes de bateria:
       grid: 16 (semicorxeres) o 12 (tresets de corxera).
       Cada instrument té la llista de posicions (0 = primer temps).
       hh = charles · sn = caixa · kk = bombo · ride = plat ride
       crash = plat crash · oh = charles obert · t1/t2/t3 = toms (agut→greu)
       ghost = cops de caixa fluixets.

   Si canvies o afegeixes cartes, només cal editar aquest fitxer.
   ===================================================================== */

window.ROCKIN_DADES = (function () {

  // ---- Petites ajudes per escriure els ritmes de manera compacta ----
  // Cada pulsació es descriu amb un símbol:
  //  Q  negra          R  silenci        EE corxera+corxera
  //  Ex corxera+sil.   xE sil.+corxera   H2 blanca (2 temps)  H3 blanca amb punt
  //  W  rodona         SSSS 4 semicorxeres   ESS  corx + 2 semi
  //  SSE 2 semi + corx SES semi corx semi    E.S corx punt + semi
  //  SE. semi + corx punt   TTT treset       T21 2/3 + 1/3   T12 1/3 + 2/3
  const SYM = {
    Q: [[0, 1]], R: [], EE: [[0, .5], [.5, .5]], Ex: [[0, .5]], xE: [[.5, .5]],
    H2: [[0, 2]], H3: [[0, 3]], W: [[0, 4]],
    SSSS: [[0, .25], [.25, .25], [.5, .25], [.75, .25]],
    ESS: [[0, .5], [.5, .25], [.75, .25]],
    SSE: [[0, .25], [.25, .25], [.5, .5]],
    SES: [[0, .25], [.25, .5], [.75, .25]],
    "E.S": [[0, .75], [.75, .25]],
    "SE.": [[0, .25], [.25, .75]],
    TTT: [[0, 1 / 3], [1 / 3, 1 / 3], [2 / 3, 1 / 3]],
    T21: [[0, 2 / 3], [2 / 3, 1 / 3]],
    T12: [[0, 1 / 3], [1 / 3, 2 / 3]],
    // compàs compost (6/8): la pulsació val una negra amb punt (1.5)
    D: [[0, 1.5]],                 // negra amb punt
    ee3: [[0, .5], [.5, .5], [1, .5]], // 3 corxeres
    eq: [[0, .5], [.5, 1]],        // corxera + negra
    qe: [[0, 1], [1, .5]],         // negra + corxera
  };
  function ritme(str) {
    // "Q Q R Q" → notes. Els símbols de 2 o 3 temps avancen el temps que ocupen.
    let t = 0; const notes = [];
    str.trim().split(/\s+/).forEach(s => {
      const pat = SYM[s]; if (!pat) throw new Error("Símbol desconegut: " + s);
      pat.forEach(([a, d]) => notes.push([+(t + a).toFixed(4), +d.toFixed(4)]));
      t += (s === "H2" ? 2 : s === "H3" ? 3 : s === "W" ? 4 : (s === "D" || s === "ee3" || s === "eq" || s === "qe") ? 1.5 : 1);
    });
    return notes;
  }
  const R = (id, deck, str) => ({ id, img: `imatges/${deck}/${id}.png`, notes: ritme(str), text: str });

  // ------------------------------ BINARI (4/4) ------------------------------
  const BINARI = [
    R("mb1", "Binari", "Q Q Q Q"), R("mb2", "Binari", "Q Q R Q"), R("mb3", "Binari", "Q R Q Q"),
    R("mb4", "Binari", "Q Q Q R"), R("mb5", "Binari", "W"), R("mb6", "Binari", "Q H2 Q"),
    R("mb7", "Binari", "Q R Q R"), R("mb8", "Binari", "Q Q R R"), R("mb9", "Binari", "R Q R Q"),
    R("mb10", "Binari", "Q R Q R"), R("mb11", "Binari", "Q Q Q xE"), R("mb12", "Binari", "xE EE xE EE"),
    R("mb13", "Binari", "EE EE EE EE"), R("mb14", "Binari", "R EE R EE"), R("mb15", "Binari", "Q EE R R"),
    R("mb16", "Binari", "Q EE EE R"), R("mb17", "Binari", "EE Q EE EE"), R("mb18", "Binari", "Q Q EE Q"),
    R("mb19", "Binari", "xE Q Q Q"), R("mb20", "Binari", "xE Q Q R"), R("mb21", "Binari", "xE xE xE xE"),
    R("mb22", "Binari", "Q xE Q Q"), R("mb23", "Binari", "Q xE Q R"), R("mb24", "Binari", "Q xE Q xE"),
    R("mb25", "Binari", "SSSS SSSS SSSS SSSS"), R("mb26", "Binari", "ESS ESS ESS ESS"),
    R("mb27", "Binari", "SSE SSE SSE SSE"), R("mb28", "Binari", "SES SES SES SES"),
    R("mb29", "Binari", "E.S E.S E.S E.S"), R("mb30", "Binari", "SE. SE. SE. SE."),
  ];

  // ------------------------------ TERNARI (3/4) -----------------------------
  // Compàs de 3 negres amb subdivisió binària (corxeres i semicorxeres); les cartes
  // amb cercles partits en tres fan tresets o compàs compost dins del 3/4.
  const TERNARI = [
    R("mt1", "Ternari", "Q Q Q"), R("mt2", "Ternari", "Q Q R"), R("mt3", "Ternari", "Q R Q"),
    R("mt4", "Ternari", "R Q Q"), R("mt5", "Ternari", "Q R R"), R("mt6", "Ternari", "R R Q"),
    R("mt7", "Ternari", "R Q R"), R("mt8", "Ternari", "H2 Q"), R("mt9", "Ternari", "Q H2"),
    R("mt10", "Ternari", "H3"), R("mt11", "Ternari", "EE EE EE"), R("mt12", "Ternari", "Q Q xE"),
    R("mt13", "Ternari", "xE Q Q"), R("mt14", "Ternari", "xE EE xE"), R("mt15", "Ternari", "Q EE xE"),
    R("mt16", "Ternari", "R EE R"), R("mt17", "Ternari", "Q EE R"), R("mt18", "Ternari", "Q EE EE"),
    R("mt19", "Ternari", "EE Q EE"), R("mt20", "Ternari", "EE Q Q"), R("mt21", "Ternari", "Q Q EE"),
    R("mt22", "Ternari", "xE xE xE"), R("mt23", "Ternari", "Q xE Q"), R("mt24", "Ternari", "xE Q R"),
    R("mt25", "Ternari", "xE Q xE"),
    R("mt26", "Ternari", "SES SES SES"), R("mt27", "Ternari", "E.S E.S E.S"), R("mt28", "Ternari", "SE. SE. SE."),
    R("mt29", "Ternari", "Q Q Q"), R("mt30", "Ternari", "TTT TTT TTT"),
    R("mt31", "Ternari", "T21 T21 T21"), R("mt32", "Ternari", "T12 T12 T12"),
    // compàs compost (6/8 dins del 3/4): dues negres amb punt
    R("mt33", "Ternari", "D D"), R("mt34", "Ternari", "ee3 ee3"),
    R("mt35", "Ternari", "eq eq"), R("mt36", "Ternari", "qe qe"),
  ];


  // ------------------------------ BATERIA -----------------------------------
  // Posicions en semicorxeres (0–15) si grid=16, o en tresets (0–11) si grid=12.
  const B = (id, num, o) => Object.assign({ id, num, img: `imatges/Bateria/${id}.png`, grid: 16 }, o);
  const HH8 = [0, 2, 4, 6, 8, 10, 12, 14], HH4 = [0, 4, 8, 12], HH16 = [...Array(16).keys()];
  const BATERIA = [
    B("5", "1", { title: "Ramones - Blitzkrieg Bop", hh: HH4, sn: [4, 12], kk: [0, 8] }),
    B("6", "2", { hh: HH4, sn: [4, 12], kk: [0, 4, 8, 12] }),
    B("7", "3", { title: "Do I Wanna Know - Arctic Monkeys", sn: [4, 12], kk: [0, 4, 8, 12] }),
    B("8", "4", { title: "We Will Rock You - Queen", sn: [4, 12], kk: [0, 2, 8, 10] }),
    B("9", "5", { title: "Uptown Funk - Bruno Mars", hh: HH8, sn: [4, 12], kk: [0, 8] }),
    B("10", "6", { ride: HH8, sn: [4, 12], kk: [0, 8] }),
    B("11", "7", { crash: [0], hh: [2, 4, 6, 8, 10, 12, 14], sn: [4, 12], kk: [0, 8] }),
    B("12", "8", { title: "Good luck, babe! - Chappell Roan", hh: HH8, sn: [4, 12], kk: [0, 4, 8, 12] }),
    B("13", "9", { hh: HH8, sn: [4, 12], kk: [0, 8, 10] }),
    B("14", "10", { hh: HH8, sn: [4, 12], kk: [0, 2, 8] }),
    B("15", "11", { title: "Dani California - Red Hot Chili Peppers", hh: HH8, sn: [4, 12], kk: [0, 2, 8, 10] }),
    B("16", "12", { hh: HH8, sn: [4, 12], kk: [0, 8, 14] }),
    B("17", "13", { hh: HH8, sn: [4, 12], kk: [0, 6, 8] }),
    B("18", "14", { title: "Zombie - The Cranberries", hh: HH8, sn: [4, 12], kk: [0, 6, 8, 10] }),
    B("19", "15", { crash: [0], hh: [2, 4, 6, 8, 10, 12], oh: [14], sn: [4, 12], kk: [0, 8] }),
    B("20", "16", { title: "Sk8er Boi - Avril Lavigne", ride: HH4, sn: [4, 12], kk: [0, 2, 8, 10] }),
    B("21", "17", { title: "La Flama - Obrint Pas", hh: [2, 6, 10, 14], sn: [4, 12], kk: [0, 8] }),
    B("22", "18", { title: "Faded - Alan Walker", hh: [2, 6, 10, 14], sn: [4, 12], kk: [0, 4, 8, 12] }),
    B("23", "19", { title: "Mil ocells - Txarango", hh: [2, 6, 10, 14], sn: [4, 12], kk: [4, 12] }),
    B("24", "20", { hh: HH4, sn: [4, 6, 12], kk: [0, 8] }),
    B("25", "21", { title: "Buhos - Volcans / Suu - Tant debó", hh: HH4, sn: [6, 12], kk: [0, 8] }),
    B("26", "21b", { hh: HH4, sn: [6, 14], ghost: [3, 11], kk: [0, 4, 8, 12] }),
    B("27", "22", { title: "Som ocells - Nil Moliner", hh: [4, 12], sn: [6, 12], kk: [0, 8] }),
    B("28", "23", { title: "Fins que arribi l'alba - Catarres", hh: HH4, sn: [4, 12], kk: [0, 10] }),
    B("29", "24", { title: "Com està el pati - Oques Grasses", hh: HH8, sn: [4, 12], kk: [0, 8], ghostkk: [7] }),
    B("30", "25", { title: "Sense tu - Teràpia de Shock", hh: HH8, sn: [4, 12], ghost: [7, 9], kk: [0, 8, 10] }),
    B("31", "26", { title: "Too sweet - Hozier", hh: HH8, sn: [4, 12], ghost: [7], kk: [0, 8, 10] }),
    B("32", "27", { title: "Urras - Adala", hh: HH8, sn: [4, 12], ghost: [7], kk: [0, 10] }),
    B("33", "27(2)", { title: "Urras - Adala", hh: HH8, sn: [4, 12], kk: [0, 2, 10], ghostkk: [7] }),
    B("34", "28", { hh: HH8, sn: [4, 12], ghost: [7, 9], kk: [0, 8, 10, 14] }),
    B("35", "29", { title: "Californication - Red Hot Chili Peppers", hh: HH8, sn: [4, 12], ghost: [7, 9], kk: [0, 10] }),
    B("36", "30", { hh: HH16, sn: [4, 12], kk: [0, 8] }),
    B("37", "31", { hh: HH16, sn: [4, 12], kk: [0, 8], ghostkk: [6] }),
    B("38", "32", { title: "Birds of a feather - Billie Eilish", hh: HH16, sn: [4, 12], kk: [0], ghostkk: [3, 6, 10] }),
    // Shuffle / tresets (grid de 12)
    B("39", "1 (shuffle)", { grid: 12, hh: [...Array(12).keys()], sn: [3, 9], kk: [0, 6] }),
    B("40", "2 (shuffle)", { title: "Perfect - Ed Sheeran", grid: 12, hh: [...Array(12).keys()], sn: [3, 9], kk: [0, 5, 6] }),
    B("41", "3 (shuffle)", { title: "Feeling Good - Muse", grid: 12, hh: [...Array(12).keys()], sn: [3, 9], kk: [0, 5, 6, 11] }),
    // Ritme amb tom de terra
    B("42", "1 (toms)", { sn: [4, 12], kk: [0, 8], t3: [0, 2, 4, 6, 7, 8, 10, 12, 14] }),
    // Breaks
    B("43", "Break 1", { brk: true, sn: [0, 1, 2, 3], t1: [4, 5, 6, 7], t2: [8, 9, 10, 11], t3: [12, 13, 14, 15] }),
    B("44", "Break 2", { brk: true, sn: [0, 1, 2, 3], t1: [4, 5, 6, 7], t2: [8, 9, 10, 11], t3: [12, 14, 15] }),
    B("45", "Break 3", { brk: true, sn: [0, 1, 3], t1: [4, 5, 7], t2: [8, 9, 11], t3: [12, 13, 15] }),
    B("46", "Break 4", { brk: true, sn: [0, 2, 3], t1: [4, 6, 7], t2: [8, 10, 11], t3: [12, 14, 15] }),
    B("47", "Break 5", { brk: true, hh: [0, 2, 4, 6, 8, 10], sn: [4, 12, 14, 15], kk: [0, 8] }),
    B("48", "Break 6", { brk: true, hh: [0, 2, 4, 6, 8, 10], sn: [4, 12, 13], kk: [0, 8, 12] }),
    B("49", "Break 7", { brk: true, hh: [0, 2, 4, 6], sn: [4, 8, 9, 10, 11, 12, 13, 14, 15], kk: [0, 8] }),
  ];

  // ------------------------------ MELÒDIC (contorn) ---------------------------
  // Cada carta és una llista de FRASES (els traços separats del dibuix). Cada frase
  // és una llista d'alçades relatives (0 = la més greu). Les frases es reparteixen
  // per igual dins del compàs, i cada alçada es converteix en una nota de l'acord
  // (0 = fonamental, 1 = tercera, 2 = quinta, 3 = fonamental aguda, …).
  const M = (n, frases) => ({ id: `pm${n}`, img: `imatges/Melodic/pm${n}.png`, contour: frases });
  // Llegit automàticament de les imatges: cada punt és una nota, cada traç és una frase.
  const MELODIC = [
    M(1, [[0, 1, 0, 1, 0]]),
    M(2, [[1, 0, 1, 0, 1]]),
    M(3, [[1, 0, 0, 1, 1, 0, 0, 1]]),
    M(4, [[0, 1, 1, 0, 0, 1, 1, 0]]),
    M(5, [[2, 2], [1, 1], [0, 0]]),
    M(6, [[0, 0], [1, 1], [2, 2]]),
    M(7, [[1, 0], [1, 0]]),
    M(8, [[1, 0], [1, 0], [1, 0], [1, 0]]),
    M(9, [[0, 1, 0, 1]]),
    M(10, [[0, 1], [0, 1]]),
    M(11, [[0, 1], [0, 1], [0, 1], [0, 1]]),
    M(12, [[0, 2], [1, 2], [1, 2], [1, 2]]),
    M(13, [[2, 0], [2, 1], [2, 1], [2, 1]]),
    M(14, [[0, 1, 2, 3], [0, 1, 2, 3]]),
    M(15, [[0, 1, 2, 3], [1, 2, 3]]),
    M(16, [[0, 1, 2, 3], [2, 3]]),
    M(17, [[3, 2, 1, 0], [3, 2, 1, 0]]),
    M(18, [[3, 2, 1, 0], [3, 2, 1]]),
    M(19, [[3, 2, 1, 0], [3, 2]]),
    M(20, [[0, 2, 1, 2]]),
    M(21, [[0, 1, 2], [0, 1, 2], [0, 1]]),
    M(22, [[2, 1, 0], [2, 1, 0], [2, 1]]),
    M(23, [[0, 2], [2, 1]]),
    M(24, [[2, 0, 1, 0]]),
    M(25, [[2, 0], [0, 1]]),
    M(26, [[0, 0], [1, 1]]),
    M(27, [[1, 1], [0, 0]]),
  ];

  // ------------------------------ RASCATS DE GUITARRA ------------------------
  // Mètrica binària: 8 (o 16) moviments de mà dreta per compàs.
  // D/U = avall/amunt tocant les cordes (fletxa negra); d/u = moviment sense tocar (fletxa grisa).
  // Llegit automàticament de les imatges.
  const G = (n, strum) => ({ id: `rg${n}`, img: `imatges/Rascats/rg${n}.png`, strum, text: strum });
  const RASCATS = [
    G(1, "DUDUDUDU"),
    G(2, "DuDUdUDU"),
    G(3, "DuDUdUDU"),
    G(4, "DUDUdUDU"),
    G(5, "dUdUdUdU"),
    G(6, "DuDuDuDu"),
    G(7, "dUDUDUDU"),
    G(8, "DuDUDUDU"),
    G(9, "DUdUDUDU"),
    G(10, "DUDuDUDU"),
    G(11, "DUDUdUDU"),
    G(12, "DUDUDuDU"),
    G(13, "DUDUDUdU"),
    G(14, "DUDUDUDu"),
    G(15, "DuDuDUdU"),
    G(16, "DuDuDUDu"),
    G(17, "DuDuDuDu"),
    G(18, "DuDuDuDUdUDudUDU"),
    G(19, "DudUduDuduDuDUdu"),
    G(20, "duDuDUduDudUduDu"),
    G(21, "duDudUduDudUduDu"),
    G(22, "DuduDudUdUDuDUdu"),
  ];

  // La veu no sona a l'app: la casella només marca si en aquesta part es canta.
  const VEU = [{ id: "veu", img: "imatges/Creacio/veu.png", nom: "Canta" }];

  // ------------------------------ ESTRUCTURA --------------------------------
  const SECCIONS = ["Intro", "Estrofa", "Pre-tornada", "Tornada", "Post-tornada", "Pont", "Melodia", "A", "B", "Coda"];

  // ------------------------------ CREACIÓ (icones d'instrument) -------------
  const INSTRUMENTS = [
    { id: "bateria", nom: "Bateria", img: "imatges/Creacio/bateria.png", baralla: "bateria" },
    { id: "teclat", nom: "Teclat", img: "imatges/Creacio/teclat.png", baralla: "ritme" },
    { id: "veu", nom: "Veu", img: "imatges/Creacio/veu.png", baralla: "veu", nomesVisual: true },
    { id: "baix", nom: "Baix", img: "imatges/Creacio/baix.png", baralla: "ritme" },
    { id: "guitarra", nom: "Guitarra", img: "imatges/Creacio/guitarra.png", baralla: "ritme" },
  ];

  // ------------------------------ PROGRESSIONS ------------------------------
  const PROGRESSIONS = [
    { nom: "I – V – vi – IV (pop)", prog: "I V vi IV" },
    { nom: "vi – IV – I – V", prog: "vi IV I V" },
    { nom: "I – vi – IV – V (anys 50)", prog: "I vi IV V" },
    { nom: "I – IV – V – IV", prog: "I IV V IV" },
    { nom: "I – IV – vi – V", prog: "I IV vi V" },
    { nom: "I – bVII – IV – I (rock)", prog: "I bVII IV I" },
    { nom: "ii – V – I – I", prog: "ii V I I" },
    { nom: "i – VI – III – VII", prog: "i VI III VII", minor: true },
    { nom: "i – iv – v – i", prog: "i iv v i", minor: true },
    { nom: "i – VII – VI – V (cadència andalusa)", prog: "i VII VI V", minor: true },
    { nom: "i – iv – VII – III", prog: "i iv VII III", minor: true },
    { nom: "i – VI – VII – i", prog: "i VI VII i", minor: true },
    { nom: "i – iv – V – i (V major)", prog: "i iv V i", minor: true },
    { nom: "I – IV (dos acords)", prog: "I IV" },
    { nom: "Blues de 12 compassos", prog: "I I I I IV IV I I V IV I V" },
  ];

  return { BINARI, TERNARI, BATERIA, MELODIC, RASCATS, VEU, SECCIONS, INSTRUMENTS, PROGRESSIONS, ritme };
})();
