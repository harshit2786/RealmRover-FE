import { useEffect } from "react";

const Github = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // Send the code to the parent window
      window.opener.postMessage({ code }, window.location.origin);

      // Close the popup after sending the code
      window.close();
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl font-bold">Processing GitHub Login...</h1>
    </div>
  );
};

export default Github;
