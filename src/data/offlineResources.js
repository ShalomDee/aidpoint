// New Orleans / Orleans Parish emergency resources, verified 2026-08-24.
// Each entry required 1 authoritative source (org's own site or a gov page)
// plus 2 independent corroborating sources agreeing on name/address/phone.
// `sourceUrl` records the authoritative source only.
//
// `placesKeyword` is a join key, not a display label — it's matched against
// CATEGORY_TO_PLACES[...].keyword (see App.js) so that clicking a HomeScreen
// category tile still surfaces the right offline results. It intentionally does
// not describe every record literally: e.g. Transportation entries carry
// "bus station" (that category's keyword) even though none of them are
// literally a bus station.
export const OFFLINE_RESOURCES = [
  // -- Police Station --
  {
    name: "NOPD First District",
    placesKeyword: "police",
    latitude: 29.9592299,
    longitude: -90.0698872,
    address: "501 N Rampart St, New Orleans, LA 70112",
    phone: "(504) 658-6010",
    sourceUrl: "https://nola.gov/next/nopd/contact/",
    lastVerified: "2026-08-24"
  },
  {
    name: "NOPD Second District",
    placesKeyword: "police",
    latitude: 29.9599870,
    longitude: -90.1087870,
    address: "3401 Broadway St, New Orleans, LA 70125",
    phone: "(504) 658-6020",
    sourceUrl: "https://nola.gov/next/nopd/contact/",
    lastVerified: "2026-08-24"
  },
  {
    name: "NOPD Fifth District",
    placesKeyword: "police",
    latitude: 29.9708290,
    longitude: -90.0347400,
    address: "3900 N Claiborne Ave, New Orleans, LA 70117",
    phone: "(504) 658-6050",
    sourceUrl: "https://nola.gov/next/nopd/contact/",
    lastVerified: "2026-08-24"
  },
  {
    name: "NOPD Seventh District",
    placesKeyword: "police",
    latitude: 30.0275315,
    longitude: -89.9681144,
    address: "10101 Dwyer Rd, New Orleans, LA 70127",
    phone: "(504) 658-6070",
    sourceUrl: "https://nola.gov/next/nopd/contact/",
    lastVerified: "2026-08-24"
  },
  {
    name: "NOPD Eighth District",
    placesKeyword: "police",
    latitude: 29.9553538,
    longitude: -90.0668461,
    address: "334 Royal St, New Orleans, LA 70130",
    phone: "(504) 658-6080",
    sourceUrl: "https://nola.gov/next/nopd/contact/",
    lastVerified: "2026-08-24"
  },

  // -- Clinic/Hospital --
  {
    name: "University Medical Center New Orleans",
    placesKeyword: "hospital",
    latitude: 29.9597986,
    longitude: -90.0821311,
    address: "2000 Canal St, New Orleans, LA 70112",
    phone: "(504) 702-3000",
    sourceUrl: "https://www.lcmchealth.org/university-medical-center-new-orleans/",
    lastVerified: "2026-08-24"
  },
  {
    name: "Manning Family Children's (Children's Hospital New Orleans)",
    placesKeyword: "hospital",
    latitude: 29.9178692,
    longitude: -90.1276405,
    address: "200 Henry Clay Ave, New Orleans, LA 70118",
    phone: "(504) 899-9511",
    sourceUrl: "https://www.manningchildrens.org/locations/main-campus-childrens-hospital/",
    lastVerified: "2026-08-24"
  },
  {
    // Physically in Jefferson Parish despite its "New Orleans, LA" mailing address;
    // kept as a regional-flagship exception per explicit user approval.
    name: "Ochsner Medical Center (flagship)",
    placesKeyword: "hospital",
    latitude: 29.9610677,
    longitude: -90.1456737,
    address: "1514 Jefferson Highway, New Orleans, LA 70121",
    phone: "(504) 842-3000",
    sourceUrl: "https://www.ochsner.org/locations/ochsner-medical-center/",
    lastVerified: "2026-08-24"
  },
  {
    name: "Touro Infirmary",
    placesKeyword: "hospital",
    latitude: 29.9258607,
    longitude: -90.0920660,
    address: "1401 Foucher St, New Orleans, LA 70115",
    phone: "(504) 897-7011",
    sourceUrl: "https://www.lcmchealth.org/touro/",
    lastVerified: "2026-08-24"
  },
  {
    name: "DePaul Community Health Centers — Carrollton",
    placesKeyword: "hospital",
    latitude: 29.9615956,
    longitude: -90.1137757,
    address: "3201 S. Carrollton Ave, New Orleans, LA 70118",
    phone: "(504) 207-3060",
    sourceUrl: "https://www.depaulcommunityhealthcenters.org/locations/carrollton",
    lastVerified: "2026-08-24"
  },

  // -- Food Bank --
  {
    name: "Broadmoor Food Pantry",
    placesKeyword: "food bank",
    latitude: 29.9493940,
    longitude: -90.1043625,
    address: "2021 S Dupre St, New Orleans, LA 70125",
    phone: "(504) 249-5130",
    sourceUrl: "https://www.broadmoorimprovement.com/bfp",
    lastVerified: "2026-08-24"
  },
  {
    name: "Sankofa Lower Nine Food Pantry (Fresh Start Market)",
    placesKeyword: "food bank",
    latitude: 29.9625043,
    longitude: -90.0219953,
    address: "5029 St. Claude Avenue, New Orleans, LA 70117",
    phone: "(504) 381-5690",
    sourceUrl: "https://sankofanola.org/lower-nine-food-pantry/",
    lastVerified: "2026-08-24"
  },
  {
    name: "Common Ground Relief Free Pantry (Levee Food Pantry)",
    placesKeyword: "food bank",
    latitude: 29.9703186,
    longitude: -90.0219117,
    address: "1800 Deslonde Street, New Orleans, LA 70117",
    phone: "(504) 312-1729",
    sourceUrl: "https://www.commongroundrelief.org/",
    lastVerified: "2026-08-24"
  },

  // -- Housing/Shelter --
  {
    name: "Ozanam Inn",
    placesKeyword: "shelter",
    latitude: 29.9576399,
    longitude: -90.0900001,
    address: "2239 Poydras Street, New Orleans, LA 70119",
    phone: "(504) 523-1184",
    sourceUrl: "https://ozanaminn.org/contactus.html",
    lastVerified: "2026-08-24",
    shelterAvailability: "year-round"
  },
  {
    name: "Covenant House New Orleans",
    placesKeyword: "shelter",
    latitude: 29.9599290,
    longitude: -90.0691432,
    address: "611 North Rampart Street, New Orleans, LA 70112",
    phone: "(504) 584-1111",
    sourceUrl: "https://covenanthousenola.org/contact/",
    lastVerified: "2026-08-24",
    shelterAvailability: "year-round"
  },
  {
    name: "New Orleans Mission",
    placesKeyword: "shelter",
    latitude: 29.9438352,
    longitude: -90.0774095,
    address: "1130 Oretha Castle Haley Blvd., New Orleans, LA 70113",
    phone: "(504) 523-2116",
    sourceUrl: "https://neworleansmission.org/contacts",
    lastVerified: "2026-08-24",
    shelterAvailability: "year-round"
  },
  {
    // "year-round" is the best-supported determination, not an explicit org statement —
    // see README shelter caveat.
    name: "New Orleans Women & Children's Shelter (NOWCS)",
    placesKeyword: "shelter",
    latitude: 29.9660567,
    longitude: -90.0854026,
    address: "2625 Iberville Street, New Orleans, LA 70119",
    phone: "(504) 522-9340",
    sourceUrl: "https://nowcs.org/contact/",
    lastVerified: "2026-08-24",
    shelterAvailability: "year-round"
  },
  {
    name: "New Orleans Low Barrier Shelter (City Shelter & Engagement Center)",
    placesKeyword: "shelter",
    latitude: 29.9546961,
    longitude: -90.0785688,
    address: "1530 Gravier Street, New Orleans, LA 70112",
    phone: "(504) 517-1815",
    sourceUrl: "https://nola.gov/nola/media/Health-Department/Publications/Street-Outreach-Resource-Guide-(1).pdf",
    lastVerified: "2026-08-24",
    shelterAvailability: "year-round"
  },

  // -- Legal Aid --
  {
    name: "Southeast Louisiana Legal Services (SLLS)",
    placesKeyword: "legal aid",
    latitude: 29.9516711,
    longitude: -90.0776407,
    address: "1340 Poydras St, Suite 600, New Orleans, LA 70112",
    phone: "(504) 529-1000",
    sourceUrl: "https://slls.org/en/contact-us/",
    lastVerified: "2026-08-24"
  },
  {
    name: "The Pro Bono Project",
    placesKeyword: "legal aid",
    latitude: 29.9529522,
    longitude: -90.0730531,
    address: "935 Gravier Street, Suite 1340, New Orleans, LA 70112",
    phone: "(504) 581-4043",
    sourceUrl: "https://www.probono-no.org/",
    lastVerified: "2026-08-24"
  },
  {
    name: "Tulane Law — Domestic Violence Clinic",
    placesKeyword: "legal aid",
    latitude: 29.9375187,
    longitude: -90.1186190,
    address: "6329 Freret St. (Weinmann Hall), New Orleans, LA 70118",
    phone: "(504) 865-5153",
    sourceUrl: "https://law.tulane.edu/contact-us-1",
    lastVerified: "2026-08-24"
  },
  {
    name: "New Orleans Bar Association — Lawyer Referral Service",
    placesKeyword: "legal aid",
    latitude: 29.9489221,
    longitude: -90.0701362,
    address: "650 Poydras Street, Suite 1505, New Orleans, LA 70130",
    phone: "(504) 561-8828",
    sourceUrl: "https://www.neworleansbar.org/for-public/find-a-lawyer/",
    lastVerified: "2026-08-24"
  },
  {
    name: "Stuart H. Smith Law Clinic (Loyola)",
    placesKeyword: "legal aid",
    latitude: 29.9372565,
    longitude: -90.1270937,
    address: "7214 St. Charles Avenue, New Orleans, LA 70118",
    phone: "(504) 861-5590",
    sourceUrl: "https://law.loyno.edu/centers/stuart-h-smith-law-clinic",
    lastVerified: "2026-08-24"
  },

  // -- Transportation --
  {
    name: "RTA — Administrative Office / Customer Service Center",
    placesKeyword: "bus station",
    latitude: 29.9671413,
    longitude: -90.0888045,
    address: "2817 Canal Street, New Orleans, LA 70119",
    phone: "(504) 248-3900",
    sourceUrl: "https://norta.com/help-and-contacts/feedback-and-customer-service",
    lastVerified: "2026-08-24"
  },
  {
    name: "RTA LIFT / Paratransit",
    placesKeyword: "bus station",
    latitude: 29.9671413,
    longitude: -90.0888045,
    address: "2817 Canal Street, New Orleans, LA 70119",
    phone: "(504) 827-7433",
    sourceUrl: "https://norta.com/ride-with-us/know-before-you-go/transit-accessibility/paratransit-service",
    lastVerified: "2026-08-24"
  },
  {
    name: "Union Passenger Terminal (Amtrak/Greyhound/Megabus hub)",
    placesKeyword: "bus station",
    latitude: 29.9464146,
    longitude: -90.0785684,
    address: "1001 Loyola Avenue, New Orleans, LA 70113",
    phone: "(800) 231-2222",
    sourceUrl: "https://www.amtrak.com/stations/nol",
    lastVerified: "2026-08-24"
  },
  {
    // Program location, activated only during a declared evacuation. 311 also
    // reaches this service; (504) 539-3266 is used here since it's dialable
    // from outside Orleans Parish too.
    name: "City-Assisted Evacuation Hub — Smoothie King Center",
    placesKeyword: "bus station",
    latitude: 29.9492271,
    longitude: -90.0803220,
    address: "1501 Dave Dixon Drive, New Orleans, LA 70113",
    phone: "(504) 539-3266",
    sourceUrl: "https://ready.nola.gov/plan/hurricane/",
    lastVerified: "2026-08-24"
  }
];
