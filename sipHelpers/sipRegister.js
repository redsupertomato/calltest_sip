import { useEffect } from 'react';
import  { UserAgent, Registerer }  from 'sip.js';

import { myLog } from '../myStuff/myStuff.js';


const sipReg2 = async (userAgent, setStatus) => {
  const routine = 'sipReg2 ';
  myLog (routine + '>>>>> start >>>>>');
  myLog (routine + 'userAgent.stateX: '+ userAgent.state);

  try {
    myLog (routine + ' registering user agent');
    const registerer = new Registerer(userAgent);
    await registerer.register();
    return registerer;
  }
  catch (err) {
    myLog (routine + ' userAgent start/register failed: ' + err.message);
  }
}

export default sipReg2;