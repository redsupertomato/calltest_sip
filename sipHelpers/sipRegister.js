import  { Registerer }  from 'sip.js';

import { myLog } from '../myStuff/myStuff.js';

const sipRegister = async ( userAgent, setStatus ) => {
  const routine = 'sipRegister ';
  myLog (routine + '>>>>> start >>>>>');
  myLog (routine + '- userAgent.state: '+ userAgent.state);

  setStatus ('Registering');

  try {
    myLog (routine + '- registering user agent');
    const registerer = new Registerer(userAgent);
    await registerer.register();
    registerer.stateChange.addListener (() => setStatus (registerer.state))
    return registerer;
  }
  catch (err) {
    msg = routine + '- userAgent register failed: ' + err.message;
    myLog (msg);
    alert (msg);
  }
}

export default sipRegister;