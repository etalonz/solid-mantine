import { createStore } from "solid-js/store";

export function useClipboard({ timeout = 2000 } = {}) {
  const [state, setState] = createStore({
    error: null,
    copied: false,
    copyTimeout: null,
  });

  const handleCopyResult = (value: boolean) => {
    clearTimeout(state.copyTimeout);
    setState({
      copyTimeout: setTimeout(() => setState({ copied: false }), timeout),
      copied: value,
    });
  };

  const copy = (valueToCopy: any) => {
    if ("clipboard" in navigator) {
      navigator.clipboard
        .writeText(valueToCopy)
        .then(() => handleCopyResult(true))
        .catch((err) => setState({ error: err }));
    } else {
      setState({
        error: new Error("useClipboard: navigator.clipboard is not supported"),
      });
    }
  };

  const reset = () => {
    setState({ error: null, copied: false });
    clearTimeout(state.copyTimeout);
  };

  return { copy, reset, error: state.error, copied: state.copied };
}
