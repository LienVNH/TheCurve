export const theme = {
  colors: {
    // Niveaus van donkergroen (van zacht naar diep)
    greenDarkest: "#15381B", // Voor buttons, headers, nav, of card background
    greenDark: "#124a37", // Hoofd-achtergrond
    green: "#3C7C40", // Lichte tinten voor borders, icons
    greenLight: "#E3F6D3", // Heel lichte groene achtergrond

    // Geel-wit tinten
    yellowLightest: "#FFFDEA", // Hoofd-achtergrond voor licht
    yellow: "#FDF6C3", // Cards, vlakken

    // Grijs, neutraal, accent
    white: "#FFFFFF",
    offWhite: "#F7F7EF",
    black: "#262626",
    border: "#DDE2D4",
    textDark: "#124a37", // Voor op lichte bg
    textLight: "#FFFDEA", // Voor op donkergroen bg

    // Accentkleuren
    primary: "#1E5128",
    succes: "#84E567",
    warning: "#F4ED10",
    backgroundColor: "#FbFbe4",

    danger: "#FF4242",

    // UI elementen
    buttonText: "#FFFDEA", // Voor op donkergroen buttons
    disabled: "#B0B0B0", // Voor disabled buttons
    link: "#1E5128", // Voor links, onderstreept
    linkHover: "#15381B", // Voor hover state van links
    cardBackground: "#F7F7EF", // Voor card achtergrond
    cardBorder: "#DDE2D4", // Voor card borders
    cardShadow: "#15381B", // Voor card schaduw
  },
  font: {
    family: "System",
    size: {
      sm: 16,
      md: 20,
      lg: 30,
      xl: 40,
    },
    weight: {
      normal: "400",
      bold: "700",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 18,
    xl: 32,
  },
  shadow: {
    card: {
      shadowColor: "#15381B",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
  },
};
