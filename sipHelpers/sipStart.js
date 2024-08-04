import  { UserAgent }  from 'sip.js';

import { myLog } from '../myStuff/myStuff.js';

const sipStart = async (setStatus) => {
  const routine = 'sipStart ';
  myLog (routine + '>>>>> start >>>>>');

  setStatus ('Starting SIP');

  const transportOptions = {
    server: "wss://rhpbxprod02.com:8089/ws"
  };

  const uri = UserAgent.makeURI("sip:10005@rhpbxprod02.com");
  if (!uri) {
    myLog (routine + " Failed to create URI");
  }
  const userAgentOptions = {
    uri,
    authorizationPassword: "Mark10005!",
    authorizationUsername: "10005",
    transportOptions
  };

  try {
    myLog (routine + '- starting user agent');
    userAgent = new UserAgent(userAgentOptions);
    await userAgent.start();
  }
  catch (err) {
    msg = routine + '- userAgent start failed: ' + err.message;
    myLog (msg);
    alert (msg);
  }
  return userAgent;
}

export default sipStart