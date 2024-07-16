import  { UserAgent, Registerer }  from 'sip.js';

const sipRegister = () => {
  console.log ('>>>>> start sipRegister')

  const transportOptions = {
    server: "wss://rhpbxprod02.com:8089/ws"
  };

  const uri = UserAgent.makeURI("sip:10005@rhpbxprod02.com");
  if (!uri) {
    console.log ("Failed to create URI");
  }
  const userAgentOptions = {
    uri,
    authorizationPassword: "Mark2Mark2",
    authorizationUsername: "10005",
    transportOptions
  };
  const userAgent = new UserAgent(userAgentOptions);

  try {
    console.log ('starting user agent');
    userAgent.start().then(() => {
      console.log ('registering user agent');
      const registerer = new Registerer(userAgent);
      registerer.register().then (() => {
        console.log ('register state: ' + registerer.state);
        setTimeout(() => {
          console.log ('register state: ' + registerer.state);
        }, 3000);
      });
    });
  }
  catch {
    console.log ('userAgent start/register failed')
  }
  return userAgent;
}

export default sipRegister