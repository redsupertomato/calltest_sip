import { UserAgent } from 'sip.js';
import { myLog } from '../myStuff/myStuff.js';

const sipStart = async (setStatus) => {
  const routine = 'sipStart ';
  myLog(routine + '>>>>> start >>>>>');

  setStatus('Starting SIP');

  const transportOptions = {
    server: "wss://sipus1.messagenius.dev/ws", // WebSocket URL
    connectionTimeout: 10000, // Timeout in milliseconds
    traceSip: true, // Enable detailed SIP tracing
    allowLegacyNotifications: true // Compatibility with older servers
  };

  const uri = UserAgent.makeURI("sip:102@sipus1.messagenius.dev");
  if (!uri) {
    const msg = routine + " Failed to create URI";
    myLog(msg);
    alert(msg);
    return null;
  }

  const userAgentOptions = {
    uri,
    authorizationPassword: "msg!", // Ensure this is correct
    authorizationUsername: "102",  // Ensure this is correct
    transportOptions,
    logConfiguration: true, // Log user agent configuration
    registererOptions: {
      expires: 600, // Registration expiration in seconds
      logConfiguration: true
    }
  };

  let userAgent = null;
  try {
    myLog(routine + '- starting user agent');
    userAgent = new UserAgent(userAgentOptions);
    await userAgent.start(); // Connect to SIP server
    myLog(routine + '- user agent started successfully');

    // Attempt to register the user agent
    const registerer = userAgent.registerer || userAgent.getRegisterer();
    if (registerer) {
      myLog(routine + '- registering user agent');
      await registerer.register();
      myLog(routine + '- user agent registered successfully');
    }
  } catch (err) {
    const msg = routine + '- userAgent start failed: ' + (err.message || err);
    myLog(msg);
    alert(msg);
    return null;
  }

  return userAgent;
};

export default sipStart;