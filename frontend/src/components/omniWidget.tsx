import { useEffect } from 'react';

const OmniWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'omnidimension-web-widget';
    script.async = true;
    script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=0fc3755f105d6f48049d5a692a10dd3c';
{/* <script id="omnidimension-web-widget" async src="https://backend.omnidim.io/web_widget.js?secret_key=02078e20d746d373d16c20f6686f4b4f" ></script> */}
    // <script id="omnidimension-web-widget" async src="https://backend.omnidim.io/web_widget.js?secret_key=11d34fbc013e49fde814608d5d74c1e3" ></script>
{/* <script id="omnidimension-web-widget" async src="https://backend.omnidim.io/web_widget.js?secret_key=02078e20d746d373d16c20f6686f4b4f" ></script> */}
  
    document.body.appendChild(script);

    // Cleanup on unmount to avoid multiple instances
    return () => {
      const existing = document.getElementById('omnidimension-web-widget');
      if (existing) {
        document.body.removeChild(existing);
      }
    };
  }, []);

  return null; // Or return a placeholder <div> if needed
};

export default OmniWidget;
