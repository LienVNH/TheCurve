// theme/theme.ts

const baseTheme = {
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

export const theme = {
  ...baseTheme,
  colors: {
    primary: "#08411E",
    primaryDark: "#234800",
    success: "#84E567",
    info: "#009DFF",
    warning: "#FFDE28",
    danger: "#FF4242",
    background: "#FBFCE4",
    border: "#CED4DA",
    textLight: "#FFFFFF",
    textDark: "#1A1A1A",
    text: {
      fontFamily: "Poppins_400Regular",
      fontSize: 16,
    },
    shades: {
      primary: {
        100: "#FFFEDA",
        200: "#FFF89C",
        300: "#FFF263",
        400: "#FFE92E",
        500: "#F4ED10",
        600: "#08411E",
        700: "#C2B800",
        800: "#9B9400",
        900: "#746F00",
      },
      success: {
        100: "#E9FCEB",
        200: "#D0F9D7",
        300: "#A3EEB2",
        400: "#84E567",
        500: "#66CC59",
        600: "#4CA744",
        700: "#3C8A36",
        800: "#2E6E2A",
        900: "#1F4F1D",
      },
      info: {
        100: "#D9F4FF",
        200: "#A8E4FF",
        300: "#75D1FF",
        400: "#42BDFF",
        500: "#009DFF",
        600: "#007AC4",
        700: "#005B8C",
        800: "#003D5D",
        900: "#002031",
      },
      warning: {
        100: "#FFF9DB",
        200: "#FFF3B2",
        300: "#FFED80",
        400: "#FFE74E",
        500: "#FFDE28",
        600: "#CCB220",
        700: "#998419",
        800: "#665711",
        900: "#332B08",
      },
      danger: {
        100: "#FFE4E4",
        200: "#FFB8B8",
        300: "#FF8A8A",
        400: "#FF5C5C",
        500: "#FF4242",
        600: "#CC3535",
        700: "#992828",
        800: "#661B1B",
        900: "#330D0D",
      },
    },
  },
};

export type AppTheme = typeof theme;
