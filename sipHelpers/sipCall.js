import { Inviter, UserAgent } from 'sip.js';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import { myLog } from '../myStuff/myStuff.js';

// Register WebRTC globals for compatibility
registerGlobals();

let routine = 'sipCall';

const sipCall = async (userAgent, ext, setStatus) => {
  myLog(routine + ' >>>>> start >>>>> Extension: ' + ext);
  setStatus('Initial');

  try {
    const targetURI = UserAgent.makeURI(`sip:${ext}@rhpbxprod02.com`);

    if (!targetURI) {
      throw new Error('Invalid target URI');
    }

    const inviter = new Inviter(userAgent, targetURI);

    // ICE server configuration
    const iceServers = [
      { urls: "stun:stun.relay.metered.ca:80" },
      { urls: "turn:global.relay.metered.ca:80", username: "3b09b9108082e268b7bcfa97", credential: "jfc6haQzbho21ot6" },
      { urls: "turn:global.relay.metered.ca:80?transport=tcp", username: "3b09b9108082e268b7bcfa97", credential: "jfc6haQzbho21ot6" },
      { urls: "turn:global.relay.metered.ca:443", username: "3b09b9108082e268b7bcfa97", credential: "jfc6haQzbho21ot6" },
      { urls: "turns:global.relay.metered.ca:443?transport=tcp", username: "3b09b9108082e268b7bcfa97", credential: "jfc6haQzbho21ot6" },
    ];

    const peerConnection = new RTCPeerConnection({ iceServers });

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        myLog(routine + ' > New ICE Candidate: ', candidate);
      } else {
        myLog(routine + ' > All ICE candidates have been sent');
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      myLog(routine + ' > ICE connection state changed to: ' + peerConnection.iceConnectionState);
    };

    peerConnection.ontrack = (event) => {
      myLog(routine + ' > Received remote track');
      // Handle remote media stream
    };

    const localStream = await mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    setStatus('Calling ' + ext + '...');

    const session = await inviter.invite();

    session.delegate = {
      onAccept: async (response) => {
        myLog(routine + ' > Call accepted');

        if (peerConnection.signalingState === 'have-local-offer') {
          const remoteDescription = new RTCSessionDescription({
            type: 'answer',
            sdp: response.message.body,
          });
          try {
            await peerConnection.setRemoteDescription(remoteDescription);
            setStatus('Call with ' + ext + ' established');

            // Send ACK after setting the remote description
            session.ack();
          } catch (error) {
            myLog(routine + ' > Failed to set remote description: ' + error.message);
            setStatus('Error: ' + error.message);
          }
        } else {
          myLog(routine + ' > Unexpected signaling state: ' + peerConnection.signalingState);
        }
      },
      onTerminate: () => {
        myLog(routine + ' > Call terminated');
        setStatus('Call with ' + ext + ' ended');
        peerConnection.close();
      },
    };
  } catch (error) {
    myLog(routine + ' > Error: ' + error.message);
    setStatus('Error: ' + error.message);
  }
};

export default sipCall;