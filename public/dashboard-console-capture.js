(function() {
  // Only activate when in iframe (dashboard preview)
  if (window.self === window.top) return;
  
  const logs = [];
  const MAX_LOGS = 500;
  
  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };
  
  // Function to capture and send logs
  function captureLog(level, args) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, (key, value) => {
            if (typeof value === 'function') return '[Function]';
            if (value instanceof Error) return value.toString();
            return value;
          }, 2);
        } catch (e) {
          return '[Object]';
        }
      }
      return String(arg);
    }).join(' ');
    
    const logEntry = {
      timestamp,
      level,
      message,
      url: window.location.href
    };
    
    // Store log entry
    logs.push(logEntry);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }
    
    // Send to parent dashboard
    try {
      window.parent.postMessage({
        type: 'console-log',
        log: logEntry
      }, '*');
    } catch (e) {
      // Silent failure - don't break the app
    }
  }
  
  // Override console methods
  console.log = function() {
    originalConsole.log.apply(console, arguments);
    captureLog('log', Array.from(arguments));
  };
  
  console.warn = function() {
    originalConsole.warn.apply(console, arguments);
    captureLog('warn', Array.from(arguments));
  };
  
  console.error = function() {
    originalConsole.error.apply(console, arguments);
    captureLog('error', Array.from(arguments));
  };
  
  console.info = function() {
    originalConsole.info.apply(console, arguments);
    captureLog('info', Array.from(arguments));
  };
  
  console.debug = function() {
    originalConsole.debug.apply(console, arguments);
    captureLog('debug', Array.from(arguments));
  };
  
  // Capture unhandled errors
  window.addEventListener('error', function(event) {
    captureLog('error', [`Unhandled error: ${event.error ? event.error.stack || event.error.message : event.message}`]);
  });
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    captureLog('error', [`Unhandled promise rejection: ${event.reason}`]);
  });
  
  // Send ready message to parent
  function sendReady() {
    try {
      window.parent.postMessage({
        type: 'console-capture-ready',
        url: window.location.href,
        timestamp: new Date().toISOString()
      }, '*');
      sendRouteChange(); // Send initial route
    } catch (e) {
      // Silent failure
    }
  }
  
  // Send route change message
  function sendRouteChange() {
    try {
      window.parent.postMessage({
        type: 'route-change',
        route: {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          href: window.location.href
        },
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) {
      // Silent failure
    }
  }
  
  // Monitor route changes
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(sendRouteChange, 0);
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(sendRouteChange, 0);
  };
  
  window.addEventListener('popstate', sendRouteChange);
  window.addEventListener('hashchange', sendRouteChange);
  
  // Send ready message when loaded
  if (document.readyState === 'complete') {
    sendReady();
  } else {
    window.addEventListener('load', sendReady);
  }
})();