import type {
  AboutData,
} from './types';

export const aboutData: AboutData = {
  eyebrow: 'About',

  headline:
    'Geography shapes how I see the world.',

  introduction: [
    [
      "I'm Moses Thiong'o, a geospatial professional based in Nairobi, Kenya.",
      'Geography has shaped the way I think: look for relationships, question',
      'what appears obvious, and understand problems in the context of place.',
    ].join(' '),

    [
      'My work has taken me through technology, research, international',
      'development, urban planning, environmental applications, and knowledge',
      'sharing. Across those settings, what continues to interest me is not',
      'simply what a tool can do, but how data, people, and technology can',
      'come together to make something useful, understandable, and lasting.',
      'The Kalabash Mosaics grew from that same instinct: learn deeply,',
      'make carefully, and share what may help someone else.',
    ].join(' '),
  ],

  introductionBold: [
    'geospatial professional',
    'technology',
    'research',
    'international development',
    'urban planning',
    'environmental applications',
    'knowledge sharing',
    'data',
    'people',
    'The Kalabash Mosaics',
  ],

  introductionItalic: [
    'useful',
    'understandable',
    'lasting',
    'learn deeply',
    'make carefully',
    'share',
  ],

  principles: [
    {
      id: 'geography',
      label: 'Geography',
      description:
        'How I understand place.',
    },

    {
      id: 'data',
      label: 'Data',
      description:
        'How I find evidence and patterns.',
    },

    {
      id: 'technology',
      label: 'Technology',
      description:
        'How I build, analyse and communicate.',
    },

    {
      id: 'impact',
      label: 'Impact',
      description:
        'Why the work matters.',
    },
  ],

  values: [
    {
      id: 'curiosity',
      number: '01',
      title: 'Curiosity',
      lead:
        'I keep asking why.',
      description:
        'I value learning, questioning assumptions, and remaining open to perspectives that change how I understand a problem.',
    },

    {
      id: 'integrity',
      number: '02',
      title: 'Integrity',
      lead:
        'I do the work properly.',
      description:
        'I believe in being truthful about what I know, careful about what I produce, and accountable for the decisions behind my work.',
    },

    {
      id: 'service',
      number: '03',
      title: 'Service',
      lead:
        'Knowledge should be useful to others.',
      description:
        'Whether through professional work, teaching, documentation, or The Kalabash Mosaics, I value using what I know in ways that help other people move forward.',
    },
  ],

  recommendations: [
    {
      id: 'james-daniel',
      name: 'James Daniel',
      role:
        'Founder at REGID International, REGID Carbon Ltd',
      relationship:
        'Managed Moses directly',
      relationshipType:
        'manager',
      recommendation: [
        'I have had the pleasure of working with Moses and have been consistently impressed by his dedication and strong work ethic.',
        'He demonstrates a high degree of commitment to learning new topics and approaches each task with genuine curiosity and discipline.',
        'Moses pays close attention to detail and applies thoughtful, structured problem-solving skills to the challenges he takes on.',
        'His willingness to learn and improve, combined with his flexibility and focus, allows him to steadily build both technical understanding and practical capability.',
        'He is a dependable team member who approaches his work with seriousness and a positive attitude, and I am confident he will continue to grow and add value wherever he applies his skills.',
        'I would gladly recommend Moses to any team seeking a motivated and diligent professional.',
      ].join(' '),
      emphasis: [
        'dedication and strong work ethic',
        'commitment to learning',
        'curiosity and discipline',
        'attention to detail',
        'thoughtful, structured problem-solving skills',
        'willingness to learn and improve',
        'flexibility and focus',
        'dependable team member',
        'positive attitude',
      ],
      source:
        'LinkedIn recommendation',
    },

    {
      id: 'christopher-mertz',
      name: 'Christopher Mertz',
      role:
        'Group Lead at Esri',
      relationship:
        'Managed Moses directly',
      relationshipType:
        'manager',
      recommendation: [
        'Musa joined my team in the summer of 2021 supporting ArcGIS Pro and ArcMap technical support cases.',
        'It has been a pleasure working with Musa since he has joined and I have seen a tremendous amount of growth from Musa during his time on the team.',
        'Musa works hard and places great emphasis on his cases and users.',
        'He goes the extra mile and is willing to take on additional challenges when they arise, such as working with tough users on the phone or working with different departments within Esri.',
        'Musa jumps on training opportunities when he can, maximizing his time within Esri Support Services so that he is always ready for the next opportunity ahead.',
        'His willingness to grow and learn with each passing case or situation will serve Musa well as he moves forward in his career.',
        'When I do have feedback to offer up to Musa, he takes what is offered seriously and strives to better himself as a person and professional everyday!',
      ].join(' '),
      emphasis: [
        'tremendous amount of growth',
        'works hard',
        'goes the extra mile',
        'willing to take on additional challenges when they arise',
        'training opportunities',
        'willingness to grow and learn',
        'strives to better himself as a person and professional everyday',
      ],
      source:
        'LinkedIn recommendation',
    },

    {
      id: 'john-nelson',
      name: 'John Nelson',
      role:
        'Maps and UX at Esri',
      relationship:
        'Mentored Moses at Esri',
      relationshipType:
        'mentor',
      recommendation: [
        "Moses's work is wonderful and he is generous in sharing his methods and infectious energy.",
        'This is content that he has shared over social media, representing cartography, analysis, and storytelling that he has undertaken in his spare time.',
        'That intrinsic drive to create and share a process with the greater community is to me is the most valuable aspect of a maker.',
      ].join(' '),
      emphasis: [
        'generous in sharing his methods and infectious energy',
        'cartography, analysis, and storytelling',
        'create and share',
      ],
      source:
        'LinkedIn recommendation',
    },

    {
      id: 'ronald-yego',
      name: 'Ronald Yego',
      role:
        'GIS and Remote Sensing Consultant',
      relationship:
        'Worked with Moses on a research project',
      relationshipType:
        'colleague',
      recommendation: [
        'Kamau was very instrumental as a GIS analyst and field data collector in research project that utilised remote sensing to evaluate land cover changes and how urbanization has affected agricultural land cover/use.',
        'He is dedicated and exceptionally dedicated to matters GIS.',
      ].join(' '),
      emphasis: [
        'very instrumental as a GIS analyst and field data collector',
        'remote sensing',
        'exceptionally dedicated to matters GIS',
      ],
      source:
        'LinkedIn recommendation',
    },

    {
      id: 'mugambi-alex',
      name: 'Mugambi ALEX',
      role:
        'MEIK',
      relationship:
        "Taught Moses during his Bachelor's degree",
      relationshipType:
        'teacher',
      recommendation: [
        "Moses was my student in Urban planning related classes while at his Bachelor's Degree at Kenyatta University where he performed exemplary well.",
        'Moses proved capability as a group leader in Urban Planning classes where he led and supervised his group on GIS-related projects.',
        "He always made sure that the group's tasks were completed on time and that they were accurate.",
        'From my interaction with Moses, he is result driven and well placed in performing tasks using software such as AutoCAD, ArchiCAD, Civil 3D, ArcGIS Suite of products (ArcMap, ArcGIS Pro), QGIS, SPSS and ERDAS Imagine.',
        'As a young professional, Moses has always proved to deliver on time.',
      ].join(' '),
      emphasis: [
        'performed exemplary well',
        'group leader',
        'completed on time',
        'accurate',
        'result driven',
        'deliver on time',
      ],
      source:
        'LinkedIn recommendation',
    },

    {
      id: 'douglas-ronoh',
      name: 'Douglas Ronoh',
      role:
        'GIS Analyst at World Resources Institute',
      relationship:
        'Mentored Moses',
      relationshipType:
        'mentor',
      recommendation:
        'Moses is passionate about solving problems using GIS and is committed to learning and applying new skills to do this.',
      emphasis: [
        'solving problems using GIS',
        'committed to learning and applying new skills',
      ],
      source:
        'LinkedIn recommendation',
    },
  ],
};
