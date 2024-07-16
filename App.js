import React, { useState } from 'react'
import { StyleSheet, View, Text, Pressable, TextInput, Keyboard } from 'react-native';
import 'expo-dev-client';

import sipRegister from './sipHelpers/sipRegister';

export default function App () {
  console.log ('>>>>> starting >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  const [status, setStatus] = useState ('idle');
  const [ext, setExt] = useState ('');

  let userAgent;

  // >>>>> Register the user.
  const handleRegister = () => {
    Keyboard.dismiss();
    alert('Registered');
    setStatus ('registering');
    userAgent = sipRegister ();
  }
  const handleCall = () => {
    Keyboard.dismiss();
    alert('Calling extension: ' + ext);
    setStatus ('calling');
    // sipCall (userAgent, ext)
  }
  return (
    <View style={styles.page}>
      <Text style={styles.text}>CallTest1</Text>
      <Pressable onPress={ handleRegister } style={styles.button}>
        <Text style={styles.title}>Register</Text>
      </Pressable>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setExt(text)}
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
