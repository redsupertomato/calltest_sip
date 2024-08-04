import React, { useState } from 'react'
import { StyleSheet, View, Text, Pressable, TextInput, Keyboard } from 'react-native';
import 'expo-dev-client';

import { myLog } from './myStuff/myStuff.js';

import sipStart from './sipHelpers/sipStart.js';
import sipRegister from './sipHelpers/sipRegister.js';
import sipCall from './sipHelpers/sipCall';

let userAgent;
let registerer;
let ext = '';

export default function App () {
  const routine = 'App';
  myLog ('\n\n\n>>>>> starting >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

  const [status, setStatus] = useState ('Idle');
  const [isRegistered, setIsRegistered] = useState (false);

  // >>>>> SIP connect to server (start) and REGISTER the phone.
  const handleRegister = async () => {
    myLog (routine  + ' > handleRegister > start')
    Keyboard.dismiss();
    try {
      userAgent = await sipStart (setStatus);  // Connect to server (asterisk).
      myLog (routine + ' > handleRegister - userAgent.state: ' + userAgent.state);
      registerer = await sipRegister (userAgent, setStatus, setIsRegistered);  // REGISTER.
      myLog (routine + ' > handleRegister - registerer.state: ' + registerer.state);
    }
    catch (err) { alert (err.message); }
  }

  // >>>>> Place a call.
  const handleCall = () => {
    Keyboard.dismiss();
    if (ext === '') { alert ('Enter an extension to call'); return; }  // Validate extension.
    sipCall (userAgent, ext, setStatus);
  }

  return (
    <View style={styles.page}>
      <Text style={styles.text}>CallTest1</Text>

      <Pressable onPress={ handleRegister } style={styles.button}>
        <Text style={styles.title}>Register</Text>
      </Pressable>

      <View style={{ display: isRegistered ? 'block' : 'none'}}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {ext = text}}
          placeholder="extension to call"
          keyboardType="numeric"
        />
        <Pressable onPress={ handleCall } style={styles.button}>
          <Text style={styles.title}>Call</Text>
        </Pressable>
      </View>
      <Text style={styles.text}>Status: {status}</Text>
    </View>
  )
}
  const styles = StyleSheet.create({
    page: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
      position: 'relative',
      top: 150,
    },
    button: {
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 20,
      padding: 10,
    },
    title: {
      fontSize: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
    },
    text: {
      marginBottom: 20,
      fontSize: 20,
    },
  });
