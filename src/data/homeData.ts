import { Movie, ComingSoonMovie, GenreFilter } from '../types/movie';

export const NOW_PLAYING_MOVIES: Movie[] = [
  {
    id: 'silent-echoes',
    title: 'Silent Echoes',
    genre: 'Thriller',
    rating: 4.7,
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDH6kHW9dhzuyQ-C5GVSY0N_WLW_B-aInWNiIFkJZBcOBjz-bq6be93nQZALl-mkkH-AhtFnLcsb5uRp7clo7ota1oa612VnG9FuZv-46Wwhfr9JkuoxzOqzIYEORPYEjk7-rJm3A-UEHRutL608s4aKiPLikgP1TQNYXsLhYamgjMb9ucqw24pwR1ykn2Q-_f3ojdsgLQEnvVZf_clvQvUf-kn1l16THTN5q8rGvuSFhjfsitLpzcX_n1FKsTYeeqwgU_7h68W_Zg',
    badges: ['IMAX', '4K'],
  },
  {
    id: 'forest-guardians',
    title: 'Forest Guardians',
    genre: 'Animation',
    rating: 4.5,
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATQzHQTix3TVN-yKBA0ultexZFKj7dDyitkj57fksWFmVa0bm0Px7yqYCtV4aRvNqFBauJK0vVRDCvCia9qETLhIk53bCWy79YSwJt3NNBqM4YT3VssZu0KaqhBnP402wtn-I4a7frZL_h8FITuKsGPrwrHK0Z1w0U0gT_t6USuRcibjcpnnnvWQeagZvcP8VYBjExT2MP7LbBW_VSXukqOVkRdDP1siWzOz85bph3_YKdrjg4rYmanOLyW3qjsxS0A99or9Bqysg',
    badges: ['3D'],
  },
  {
    id: 'velocity-redline',
    title: 'Velocity: Redline',
    genre: 'Action',
    rating: 4.2,
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLY-mu4izS-HRToVx_Dcxpc-yxILGRb8ToRvITQHsHyS7POOYuzgW3-ApWEH6vzKw3k0rO3tv81xxLyFQuZnf7O2FydgYRMaFkvGBOiV0vK8qcUjsHgS-YohFfBjYocSAr5GDE3aRMyf_kZMaa_nSk35Lt7n1brp-eLgwVnxnyng5acaS5bk6qoo2DruH9k-bSWuVVPBmkOaNJ0xlTuRllJ9nONvQzqu1vkc--LCtSfa4eNIO_RUnIVZZTazbaHMI4g__9asnTPh0',
    badges: [],
  },
  {
    id: 'the-reflection',
    title: 'The Reflection',
    genre: 'Horror',
    rating: 4.8,
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnL0GR2nsYYGCKFtfXTGFDNlo_0xXpHHLEaaO7m8jGDFN0VYu5q25m0eZwQnRWeIwdUYI8XSvnH21mL_1qH37feuG2KIqppPf9d3WD18uoDyQMVtBotrIA42CaiyWCp0La6JPuejnccafv_bGpqYkgk6021yWgYNV7EubsMUHkMuATtff5h1PyC4BAC7lWjtNDa3il70R10bpIhYt9SjLGnmthNiYV9hx0Fip0cBxT5vk26LUhYhi4hKibK10abXCR3UkK792aCns',
    badges: ['DOLBY'],
  },
  {
    id: 'after-the-rain',
    title: 'After the Rain',
    genre: 'Drama',
    rating: 4.6,
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBrrb3lhsfEh5lb3ClO7IARUpkvta0eA8HGGYKu8dLtWa0kcP8sCNfru-YBOzFg1bJELS98n8D9LHvEB-weIBsXc-EX8qS59AqFM_L7TV6DS0VX7XjbNln2LUb8_spCL2oEfHyXqQ0eAErRH9NTSI5J-y8fzEvLF1iy2OPi1DoHf9zFAHu_gAklXEb2GUNESNDIcVVAa81FmtSigfEHiFx9PeN-rx2cK9ik_wilEhKtzSJBnVWDU0A9oCo2wQMk4xXjgeGpmyrgSBk',
    badges: [],
  },
];

export const COMING_SOON_MOVIES: ComingSoonMovie[] = [
  {
    id: 'nebula-ascendant',
    title: 'NEBULA ASCENDANT',
    releaseDate: 'RELEASING DEC 15',
    description: 'The next chapter in interstellar travel. Tickets available next week.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAEJXs8XwFIn4ou3u5wO9_xx77uLG5oWwl59ujRxz0aV-Gr4Szg44vz8L8idU239uqMKQWDYgzkKfXUpeoPt2pZJAzM_15GlVh5NgJ8IBZ5SEz_XW_ctSI5FkilxihGC0U67YPSlpGJS_wnAUjfJNUrZXF-mMebJhPoNQaMjns45UCTnWIF_PdEsUZxlqBHEOV0dQ1dGvCYioWxhbtBSgNPYk-1tRziESCXMz821HdvFHsLkve9PfnyxyN3jceHtWIeByvDSMmSPNo',
    featured: true,
  },
  {
    id: 'shadow-realm',
    title: 'Shadow Realm',
    releaseDate: 'OCT 31',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAWc13usWUiBJYxV6sNK7GZa_g1uU7OdrkFhVJ2zIG3htpOxwHowNKabsx4ZcJ9FP3M-w5U4pC4GMXVHAFsfuaH0vsXyUIbBWqiAOUr2a_IysMJpSBC6_uF04zOIaZXb2stcaPSzGIhyqZIp9MBvnggF1LgPXVF5f_E5B_arykeTyDNziB5or4dvQwCiqfak3zCmsa-vJWFI8YkWRECa9oWjC1NwS5O976Y7_DezXTzl1k_o3e509L6EOJ5dzI2KgAMZVBlu4xPSw',
    featured: false,
  },
];

export const GENRE_FILTERS: GenreFilter[] = [
  'All Movies',
  'Action',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Comedy',
];

export const HERO_MOVIE = {
  title: 'STELLARIS:\nVOID PROTOCOL',
  tagline: 'TRENDING #1',
  rating: 4.9,
  description:
    "In a galaxy on the brink of collapse, one pilot must cross the event horizon to save what's left of humanity. Experience the epic conclusion to the Stellaris saga in IMAX.",
  genres: ['Sci-Fi', 'Adventure', 'IMAX 3D'],
  backdropUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBwN1OtlWfsarhiuF-l5aEky8Wd17ihqmAeaUh2Zqi6mw5V_ulx61I4OzgsrYmW16wwT_HWod0zujvpAVgZUr91xo5bFK1_Xc3_1L1jGq-Q1unNc_CRm-Rbxsf6hp-_dD-KscQvSYHJnCc3VCLB2aeQvCwXjZZ-SukoLKMAVztmOHuhz7Kq9u2iBSrkE8Pa_aQI8q1wG9TQR8B6Vi8x_o48rW-ygBx64gncOUWVl4mE0zCf4ovDC1Lih-uKzilXMPNR0FVnSp65h_U',
  mapImageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDtgEX7b7r3anqSq5wHxBrT0_Cas70UUhDoildFDIvh0UXn4WTaXLUbBRP-Z-mRzIFG8HLtbWlWJt_8oupaCjtjGH5NWfItAcEDMLcrqmW5zauS-bDurOAFKTcE2TNvmA4TEO8w5LiWCIvCs5s4ZuCEhtC_KQ_vTnkKWxaz-NJvtH5UhcLHBgSohmBN90RUTg2YreS_2DJw31WyhZAg1AOD8g6mcHBbGeuO4KQCVvCoW5LL85qr62bD84OxDJ9YTi9RIQ_BIkmTCZM',
};
