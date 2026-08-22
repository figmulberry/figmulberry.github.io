export type TimezoneCenter = {
  latitude: number;
  longitude: number;
};

const timezoneCenters:
  Record<
    string,
    TimezoneCenter
  > = {
    // Africa
    'Africa/Nairobi': {
      latitude: -1.286389,
      longitude: 36.817223,
    },

    'Africa/Cairo': {
      latitude: 30.04442,
      longitude: 31.235712,
    },

    'Africa/Johannesburg': {
      latitude: -26.204103,
      longitude: 28.047305,
    },

    'Africa/Lagos': {
      latitude: 6.524379,
      longitude: 3.379206,
    },

    'Africa/Accra': {
      latitude: 5.603717,
      longitude: -0.186964,
    },

    'Africa/Casablanca': {
      latitude: 33.57311,
      longitude: -7.589843,
    },

    // North America
    'America/Anchorage': {
      latitude: 61.218056,
      longitude: -149.900278,
    },

    'America/Los_Angeles': {
      latitude: 34.052235,
      longitude: -118.243683,
    },

    'America/Denver': {
      latitude: 39.739236,
      longitude: -104.990251,
    },

    'America/Chicago': {
      latitude: 41.878113,
      longitude: -87.629799,
    },

    'America/New_York': {
      latitude: 40.712776,
      longitude: -74.005974,
    },

    'America/St_Johns': {
      latitude: 47.56151,
      longitude: -52.712576,
    },

    'America/Toronto': {
      latitude: 43.653225,
      longitude: -79.383186,
    },

    'America/Vancouver': {
      latitude: 49.282729,
      longitude: -123.120738,
    },

    'America/Mexico_City': {
      latitude: 19.432608,
      longitude: -99.133209,
    },

    // South America
    'America/Caracas': {
      latitude: 10.480594,
      longitude: -66.903606,
    },

    'America/Sao_Paulo': {
      latitude: -23.55052,
      longitude: -46.633308,
    },

    'America/Santiago': {
      latitude: -33.44889,
      longitude: -70.669265,
    },

    'America/Lima': {
      latitude: -12.046374,
      longitude: -77.042793,
    },

    'America/Bogota': {
      latitude: 4.711,
      longitude: -74.0721,
    },

    'America/Argentina/Buenos_Aires': {
      latitude: -34.603722,
      longitude: -58.381592,
    },

    // Europe
    'Europe/London': {
      latitude: 51.507351,
      longitude: -0.127758,
    },

    'Europe/Paris': {
      latitude: 48.856613,
      longitude: 2.352222,
    },

    'Europe/Berlin': {
      latitude: 52.52,
      longitude: 13.405,
    },

    'Europe/Madrid': {
      latitude: 40.416775,
      longitude: -3.70379,
    },

    'Europe/Rome': {
      latitude: 41.902782,
      longitude: 12.496366,
    },

    'Europe/Athens': {
      latitude: 37.98381,
      longitude: 23.727539,
    },

    'Europe/Moscow': {
      latitude: 55.755825,
      longitude: 37.617298,
    },

    // Asia and Middle East
    'Asia/Tehran': {
      latitude: 35.689198,
      longitude: 51.388974,
    },

    'Asia/Dubai': {
      latitude: 25.204849,
      longitude: 55.270783,
    },

    'Asia/Kabul': {
      latitude: 34.555349,
      longitude: 69.207486,
    },

    'Asia/Karachi': {
      latitude: 24.860735,
      longitude: 67.001137,
    },

    'Asia/Kolkata': {
      latitude: 22.572645,
      longitude: 88.363892,
    },

    'Asia/Kathmandu': {
      latitude: 27.717245,
      longitude: 85.323961,
    },

    'Asia/Dhaka': {
      latitude: 23.810332,
      longitude: 90.412518,
    },

    'Asia/Yangon': {
      latitude: 16.840939,
      longitude: 96.173526,
    },

    'Asia/Bangkok': {
      latitude: 13.756331,
      longitude: 100.501762,
    },

    'Asia/Singapore': {
      latitude: 1.352083,
      longitude: 103.819839,
    },

    'Asia/Shanghai': {
      latitude: 31.230391,
      longitude: 121.473701,
    },

    'Asia/Hong_Kong': {
      latitude: 22.319303,
      longitude: 114.169361,
    },

    'Asia/Seoul': {
      latitude: 37.566536,
      longitude: 126.977966,
    },

    'Asia/Tokyo': {
      latitude: 35.6762,
      longitude: 139.6503,
    },

    // Australia and Oceania
    'Australia/Perth': {
      latitude: -31.952312,
      longitude: 115.861309,
    },

    'Australia/Eucla': {
      latitude: -31.679,
      longitude: 128.884,
    },

    'Australia/Adelaide': {
      latitude: -34.928499,
      longitude: 138.600746,
    },

    'Australia/Brisbane': {
      latitude: -27.46977,
      longitude: 153.025131,
    },

    'Australia/Sydney': {
      latitude: -33.86882,
      longitude: 151.209296,
    },

    'Australia/Melbourne': {
      latitude: -37.813629,
      longitude: 144.963058,
    },

    'Australia/Lord_Howe': {
      latitude: -31.5553,
      longitude: 159.082,
    },

    'Pacific/Auckland': {
      latitude: -36.848461,
      longitude: 174.763336,
    },

    'Pacific/Chatham': {
      latitude: -43.95353,
      longitude: -176.55973,
    },

    'Pacific/Guadalcanal': {
      latitude: -9.445638,
      longitude: 159.972899,
    },

    'Pacific/Tongatapu': {
      latitude: -21.139342,
      longitude: -175.204947,
    },

    'Pacific/Kiritimati': {
      latitude: 1.8721,
      longitude: -157.4278,
    },

    'Pacific/Honolulu': {
      latitude: 21.306944,
      longitude: -157.858337,
    },

    'Pacific/Marquesas': {
      latitude: -8.91093,
      longitude: -140.09972,
    },

    'Pacific/Pago_Pago': {
      latitude: -14.275632,
      longitude: -170.702036,
    },

    // Atlantic
    'Atlantic/Cape_Verde': {
      latitude: 14.93305,
      longitude: -23.513327,
    },

    // Greenland
    'America/Nuuk': {
      latitude: 64.18347,
      longitude: -51.72157,
    },
  };

const regionFallbacks:
  Record<
    string,
    TimezoneCenter
  > = {
    Africa: {
      latitude: 3,
      longitude: 22,
    },

    America: {
      latitude: 8,
      longitude: -75,
    },

    Europe: {
      latitude: 50,
      longitude: 12,
    },

    Asia: {
      latitude: 28,
      longitude: 90,
    },

    Australia: {
      latitude: -25,
      longitude: 135,
    },

    Pacific: {
      latitude: -10,
      longitude: -150,
    },

    Atlantic: {
      latitude: 20,
      longitude: -30,
    },

    Indian: {
      latitude: -10,
      longitude: 75,
    },

    Antarctica: {
      latitude: -75,
      longitude: 0,
    },
  };

export const defaultTimezoneCenter:
  TimezoneCenter = {
    latitude: 12,
    longitude: 0,
  };

export function getTimezoneCenter(
  timeZone: string | undefined,
): TimezoneCenter {
  if (!timeZone) {
    return defaultTimezoneCenter;
  }

  const exact =
    timezoneCenters[
      timeZone
    ];

  if (exact) {
    return exact;
  }

  const region =
    timeZone.split(
      '/',
    )[0];

  if (
    region &&
    regionFallbacks[
      region
    ]
  ) {
    return regionFallbacks[
      region
    ];
  }

  return defaultTimezoneCenter;
}