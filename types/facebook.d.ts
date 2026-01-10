interface Window {
  fbAsyncInit: () => void;
  FB: {
    init: (params: { xfbml?: boolean; version: string }) => void;
  };
}
