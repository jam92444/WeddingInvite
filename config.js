/* =========================================================
   FALAK & ASIF — NIKAH INVITATION CONFIGURATION
   Edit this file only. All repeated names, dates, copy,
   media paths, feature flags and colours derive from here.
   ========================================================= */

const INVITATION_CONFIG = {
  theme: "ruby", // "ruby" or "starlight"

  event: {
    type: "Nikah",
    kicker: "With the blessings of Almighty Allah",
    coupleLine: "Falak weds Asif",
    bride: {
      name: "Falak Naaz",
      parents: "D/o Mr. Mushtaq Ahmed & Late Mr. Mohammed Haneef"
    },
    groom: {
      name: "Mohammed Asif",
      parents: "S/o Mr. Mohammed Kasim & Late Mr. Ubaidur Rahman"
    },
    dateISO: "2026-11-20",
    // SAMPLE TIME — replace with the confirmed Nikah time.
    // Used for the countdown and calendar invitation.
    time24: "19:15",
    timeDisplay: "After Namaz-e-Maghrib",
    timeZone: "Asia/Kolkata",
    timeZoneLabel: "IST",
    host: "Mr. Mushtaq Ahmed",
    contactNumbers: ["80988 32802", "88706 71114"]
  },

  letter: {
    greeting: "Assalamu Alaikum Wa Rahmatullahi Wa Barakatuh,",
    body: [
      "Mr. Mushtaq Ahmed requests the honour of your presence, along with your family and friends, at the Nikah of his beloved daughter.",
      "Your presence, prayers and blessings will make this joyous occasion truly memorable."
    ],
    signature: "With heartfelt regards,\nMr. Mushtaq Ahmed & Family"
  },

  schedule: {
    enabled: true,
    title: "Order of the Evening",
    items: [
      {
        time: "After Maghrib",
        title: "Arrival of Baraat",
        description: "The Baraat arrives and guests are warmly received."
      },
      {
        time: "After Maghrib",
        title: "Nikah Ceremony",
        description: "The Nikah ceremony will be performed, followed by prayers and blessings."
      },
      {
        time: "Thereafter",
        title: "Dinner",
        description: "Dinner will be served in honour of the honoured guests."
      }
    ]
  },

  venue: {
    enabled: true,
    name: "Azizia Convention Hall",
    address: "Padrayanapura, Bangalore – 26",
    additional: "Near Amir Kaleemi Masjid, Jabbar Bhai ki Building, Old Guddadahalli, Bangalore – 26",
    // No embed URL was supplied, so no map iframe is inserted.
    mapSearchQuery: "Azizia Convention Hall, Padrayanapura, Bangalore 26",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Azizia%20Convention%20Hall%2C%20Padrayanapura%2C%20Bangalore%2026"
  },

  dressCode: { enabled: false, title: "", text: "", swatches: [] },
  wishes: { enabled: false, title: "", text: "" },
  faq: { enabled: false, title: "", items: [] },

  guestReplies: {
    // No submission endpoint was supplied, so the live form is omitted.
    enabled: false,
    endpoint: "",
    requiredFields: ["name", "attendance"]
  },

  media: {
    // Place optional files in /assets and update these paths.
    openingVideo: "", // e.g. "assets/opening.mp4"
    poster: "",       // e.g. "assets/poster.jpg"
    music: ""         // e.g. "assets/music.mp3"
  },

  closing: {
    signOff: "We look forward to welcoming you and sharing this blessed occasion.",
    repeatDate: "Friday, 20 November 2026 · After Namaz-e-Maghrib"
  }
};
