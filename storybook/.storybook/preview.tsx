import { render } from "solid-js/web";
//import { useDarkMode } from "storybook-dark-mode";
import { MantineProvider, ColorSchemeProvider } from "../../src/styles";

export const parameters = { layout: "fullscreen" };

function ThemeWrapper(props) {
  return (
    <ColorSchemeProvider
      colorScheme={() => "light"}
      toggleColorScheme={() => {}}
    >
      <MantineProvider
        theme={{
          //   colorScheme: useDarkMode() ? "dark" : "light",
          headings: { fontFamily: "Greycliff CF, sans-serif" },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        {props.children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

let disposeStory;

export const decorators = [
  (Story) => {
    if (disposeStory) {
      disposeStory();
    }

    const root = document.getElementById("root")!;
    const solidRoot = document.createElement("div");

    solidRoot.setAttribute("id", "solid-root");
    root.appendChild(solidRoot);

    disposeStory = render(
      () => <ThemeWrapper>{Story}</ThemeWrapper>,
      solidRoot
    );

    return solidRoot;
  },
];
