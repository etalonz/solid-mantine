import { createStyles } from "styles";

export default createStyles(() => ({
  input: {
    "&:not(:disabled)": {
      cursor: "pointer",

      "&::selection": {
        backgroundColor: "transparent",
      },
    },
  },
}));
