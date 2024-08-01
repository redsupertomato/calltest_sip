import { useEffect } from 'react';
import  { UserAgent, Registerer }  from 'sip.js';

import { myLog } from '../myStuff/myStuff.js';

const sipRegister = async (setStatus) => {
  const routine = 'sipRegister ';
  myLog (routine + '>>>>> start sipRegister');

  const transportOptions = {
    server: "wss://rhpbxprod02.com:8089/ws"
  };

  const uri = UserAgent.makeURI("sip:10005@rhpbxprod02.com");
  if (!uri) {
    myLog (routine + " Failed to create URI");
  }
  const userAgentOptions = {
    uri,
    authorizationPassword: "Mark2Mark2",
    authorizationUsername: "10005",
    transportOptions
  };
  userAgent = new UserAgent(userAgentOptions);

  try {
    myLog (routine + ' starting user agent');
    await userAgent.start();
  }
  catch {
    myLog (routine + ' userAgent start/register failed')
  }
  return userAgent;
  // return  { userAgent, registerer };
}

export default sipRegister