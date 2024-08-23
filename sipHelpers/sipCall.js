import { myLog } from '../myStuff/myStuff.js';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import { Inviter, SessionState, UserAgent } from 'sip.js';
import Sound from 'react-native-sound';

registerGlobals();
let routine = 'sipCall';

const sipCall = async (userAgent, ext, setStatus) => {
  myLog(`${routine} >>>>> start >>>>> Extension: ${ext}`);
  setStatus(`Preparing to call ${ext}`);

  const peerConstraints = {
    iceServers: [
      
    ],
  };

  const peerConnection = new RTCPeerConnection(peerConstraints);

  peerConnection.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      console.log('ICE Candidate:', event.candidate);
    } else {
      console.log('All ICE candidates have been sent');
    }
  });

  peerConnection.addEventListener('track', (event) => {
    console.log('REDTOMATO >>> Track received');
    const remoteStream = new MediaStream();
    remoteStream.addTrack(event.track);

    // Play the received audio track using react-native-sound or directly from the stream
    const sound = new Sound(remoteStream, (error) => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }
      sound.play((success) => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.error('Playback failed due to audio decoding errors');
        }
      });
    });
  });

  try {
    const audioStream = await mediaDevices.getUserMedia({ audio: true, video: false });
    audioStream.getTracks().forEach((track) => peerConnection.addTrack(track, audioStream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    const targetURI = UserAgent.makeURI(`sip:${ext}@rhpbxprod02.com`);
    if (!targetURI) {
      throw new Error('Failed to create target URI');
    }

    const inviteOptions = {
      extraHeaders: ['X-App-Command: barge'],
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false, // Ensures only audio is used
        },
      },
    };

    const inviter = new Inviter(userAgent, targetURI, inviteOptions);

    inviter.stateChange.addListener((state) => {
      console.log('REDTOMATO >>> ', state);
      if (state === SessionState.Establishing) {
        setStatus('Call establishing');
      } else if (state === SessionState.Established) {
        setStatus('Call established');
      } else if (state === SessionState.Terminated) {
        setStatus('Call terminated');
      }
    });

    await inviter.invite();

    setStatus(`Calling ${ext}`);
  } catch (err) {
    myLog(`${routine} - Error: ${err.message}`);
    setStatus(`Error calling ${ext}`);
  }
};

export default sipCall;