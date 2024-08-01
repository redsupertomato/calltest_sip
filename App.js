import React, { useState, useRef } from 'react'
import { StyleSheet, View, Text, Pressable, TextInput, Keyboard } from 'react-native';
import 'expo-dev-client';

import { myLog } from './myStuff/myStuff.js';

import sipStart from './sipHelpers/sipStart.js';
import sipRegister from './sipHelpers/sipRegister.js';

import sipCall from './sipHelpers/sipCall';

let userAgent;
let registerer;

export default function App () {
  const routine = 'App';
  myLog ('\n\n\n>>>>> starting >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  const [status, setStatus] = useState ('idle');

  // const userAgent = useRef ();
  // const registerer = useRef ();

  let ext;

  // >>>>> Register the user.
  const handleRegister = async () => {
    myLog (routine  + '> handleRegister: registering')
    Keyboard.dismiss();
    setStatus ('registering');
    try {
      userAgent = await sipStart (setStatus);
      myLog (routine + '> handleRegister - userAgent.state: ' + userAgent.state);
      registerer = await sipRegister (userAgent, setStatus)
      myLog (routine + '> handleRegister - registerer.state: ' + registerer.state);
      registerer.addListener (registerer.stateChange, () => setStatus (registerer.state))
    }
    catch (err) { alert (err.message); }
  }
  const handleCall = () => {
    Keyboard.dismiss();
    setStatus ('calling ' + ext);
    myLog (routine + ' handleCall - userAgent.state: ' + userAgent.state);
    sipCall (userAgent, ext)
  }
  return (
    <View style={styles.page}>
      <Text style={styles.text}>CallTest1</Text>
      <Pressable onPress={ handleRegister } style={styles.button}>
        <Text style={styles.title}>Register</Text>
      </Pressable>
      <TextInput
        style={styles.input}
        onChangeText={(text) => {ext = text}}
        placeholder="extension to call"
        keyboardType="numeric"
      />
      <Pressable onPress={ handleCall } style={styles.button}>
        <Text style={styles.title}>Call</Text>
      </Pressable>
      <Text style={styles.text}>Status: {status}</Text>
    </View>
  )
}
  const styles = StyleSheet.create({
    page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
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
