// src/data/partyNetwork.js

const PARTY_NETWORK = [
  {
    id: "union-01",
    type: "union",
    nameTa: "திருச்சி மேற்கு யூனியன்",
    roleTa: "யூனியன் செயலாளர்",
    person: "திரு. முத்துக்குமார்",
    phone: "+91 90000 00001",
    villages: [
      {
        id: "village-01-01",
        type: "village",
        nameTa: "அண்ணா நகர் கிராமம்",
        roleTa: "கிராம செயலாளர்",
        person: "திரு. செல்வராஜ்",
        phone: "+91 90000 00011",
        wards: [
          {
            id: "ward-01-01-01",
            type: "ward",
            nameTa: "வார்டு 1",
            roleTa: "வார்டு தலைவர்",
            person: "திரு. கார்த்திக்",
            phone: "+91 90000 00021",
            booths: [
              {
                id: "booth-01-01-01-01",
                type: "booth",
                nameTa: "பூத் 101 – அரசு பள்ளி",
                roleTa: "பூத் முகவர்",
                person: "திரு. மணிகண்டன்",
                phone: "+91 90000 00031"
              },
              {
                id: "booth-01-01-01-02",
                type: "booth",
                nameTa: "பூத் 102 – அங்கன்வாடி நிலையம்",
                roleTa: "பூத் முகவர்",
                person: "திருமதி. லதா",
                phone: "+91 90000 00032"
              }
            ]
          },
          {
            id: "ward-01-01-02",
            type: "ward",
            nameTa: "வார்டு 2",
            roleTa: "வார்டு தலைவர்",
            person: "திரு. ஆனந்த்",
            phone: "+91 90000 00022",
            booths: [
              {
                id: "booth-01-01-02-01",
                type: "booth",
                nameTa: "பூத் 201 – மாநகராட்சி அலுவலகம்",
                roleTa: "பூத் முகவர்",
                person: "திரு. சுரேஷ்",
                phone: "+91 90000 00033"
              }
            ]
          }
        ]
      },
      {
        id: "village-01-02",
        type: "village",
        nameTa: "காந்தி நகர் கிராமம்",
        roleTa: "கிராம செயலாளர்",
        person: "திரு. ராமசாமி",
        phone: "+91 90000 00012",
        wards: [
          {
            id: "ward-01-02-01",
            type: "ward",
            nameTa: "வார்டு 1",
            roleTa: "வார்டு தலைவர்",
            person: "திரு. நவீன்",
            phone: "+91 90000 00023",
            booths: [
              {
                id: "booth-01-02-01-01",
                type: "booth",
                nameTa: "பூத் 301 – சமூகக் கூடம்",
                roleTa: "பூத் முகவர்",
                person: "திரு. பாலசுப்பிரமணியம்",
                phone: "+91 90000 00034"
              }
            ]
          }
        ]
      }
    ]
  },

  {
    id: "union-02",
    type: "union",
    nameTa: "திருச்சி கிழக்கு யூனியன்",
    roleTa: "யூனியன் செயலாளர்",
    person: "திரு. பாலமுருகன்",
    phone: "+91 90000 00002",
    villages: [
      {
        id: "village-02-01",
        type: "village",
        nameTa: "நேரு நகர் கிராமம்",
        roleTa: "கிராம செயலாளர்",
        person: "திரு. பிரகாஷ்",
        phone: "+91 90000 00013",
        wards: [
          {
            id: "ward-02-01-01",
            type: "ward",
            nameTa: "வார்டு 1",
            roleTa: "வார்டு தலைவர்",
            person: "திரு. விக்னேஷ்",
            phone: "+91 90000 00024",
            booths: [
              {
                id: "booth-02-01-01-01",
                type: "booth",
                nameTa: "பூத் 401 – பேருந்து நிலையம்",
                roleTa: "பூத் முகவர்",
                person: "திரு. முரளி",
                phone: "+91 90000 00035"
              }
            ]
          }
        ]
      }
    ]
  },

  {
    id: "union-03",
    type: "union",
    nameTa: "முசிரி யூனியன்",
    roleTa: "யூனியன் செயலாளர்",
    person: "திருமதி. ஜெயலட்சுமி",
    phone: "+91 90000 00003",
    villages: [
      {
        id: "village-03-01",
        type: "village",
        nameTa: "அரியமங்கலம் கிராமம்",
        roleTa: "கிராம செயலாளர்",
        person: "திரு. கணேஷ்",
        phone: "+91 90000 00014",
        wards: [
          {
            id: "ward-03-01-01",
            type: "ward",
            nameTa: "வார்டு 1",
            roleTa: "வார்டு தலைவர்",
            person: "திரு. அருண்",
            phone: "+91 90000 00025",
            booths: [
              {
                id: "booth-03-01-01-01",
                type: "booth",
                nameTa: "பூத் 501 – அரசு உதவி பள்ளி",
                roleTa: "பூத் முகவர்",
                person: "திரு. குமரன்",
                phone: "+91 90000 00036"
              },
              {
                id: "booth-03-01-01-02",
                type: "booth",
                nameTa: "பூத் 502 – சமுதாய மண்டபம்",
                roleTa: "பூத் முகவர்",
                person: "திரு. சுந்தர்",
                phone: "+91 90000 00037"
              }
            ]
          }
        ]
      }
    ]
  }
];

export default PARTY_NETWORK;
