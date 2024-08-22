import { myLog } from '../myStuff/myStuff.js';

// Assuming you have a library like sip.js available
import { Inviter, UserAgent } from 'sip.js'; // Example for sip.js
import { registerGlobals } from 'react-native-webrtc';

let routine = 'sipCall';
registerGlobals();

const sipCall = async (userAgent, ext, setStatus) => {

  myLog(`${routine} >>>>> start >>>>> Extension: ${ext}`);
  setStatus(`Preparing to call ${ext}`);

  try {
    // Assuming the userAgent is an instance of a SIP library's user agent
    // Create a URI for the extension you want to call
    const targetURI = UserAgent.makeURI(`sip:${ext}@rhpbxprod02.com`);

    if (!targetURI) {
      throw new Error('Invalid target URI');
    }

    // Create an inviter (or similar) to handle the outgoing call
    const inviter = new Inviter(userAgent, targetURI);

    // Add listeners for call events
    inviter.stateChange.addListener((state) => {
      myLog(`Call state changed to: ${state}`);
      setStatus(`Call state: ${state}`);

      if (state === 'established') {
        // Call successfully established
        myLog('Call established');
        setStatus('Call in progress');
      } else if (state === 'terminated') {
        // Call ended
        myLog('Call terminated');
        setStatus('Call ended');
      }
    });

    // Send the INVITE request to initiate the call
    await inviter.invite();
    myLog('INVITE sent');
    setStatus(`Calling ${ext}...`);
  } catch (err) {
    myLog(`${routine} error: ${err.message}`);
    setStatus(`Call failed: ${err.message}`);
  }
};

export default sipCall;