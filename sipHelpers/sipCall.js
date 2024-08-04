import React from 'react'

import { myLog } from '../myStuff/myStuff.js';

let routine = 'sipCall';

const sipCall = (userAgent, ext, setStatus) => {
  myLog (routine + ' >>>>> start >>>>> Extension: '+ ext);
  setStatus ('Prepare to call '+ ext);

  // Add SIP calling (INVITE) here.
  // Update screen status as call setup progresses.
}

export default sipCall