/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { useState, useEffect } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import notifee, { AuthorizationStatus, EventType, AndroidImportance } from '@notifee/react-native'

export default function App(){
  const [statusNotification, setStatusNotification] = useState(true);
  
  useEffect(() => {
    
    async function getPermission(){
      
      const settings = await notifee.requestPermission();
      if(settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED){
        setStatusNotification(true);
        return console.log("Permission: ", settings.authorizationStatus);
      }
      console.log("Usuario negou a permissao!");
      setStatusNotification(false);
    }

    getPermission();
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent( ({ type, detail }) => {
      switch(type){
        case EventType.DISMISSED:
          console.log("USUARIO DESCARTOU A NOTIFICAÇÃO");
          break;
        case EventType.PRESS: 
         console.log("TOCOU: ", detail.notification);
      }
    });
  }, []);

  async function handleNotificate() {
    if(!statusNotification){
      return;
    }

    const channelId = await notifee.createChannel({
      id: 'lembrete',
      name: 'Lembrete',
      vibration: true,
      importance: AndroidImportance.HIGH
    });

    await notifee.displayNotification({
      id: 'lembrete',
      title: 'Estudar programação',
      body: 'Lembrete para estudar react amanha!',
      android: {
        channelId,
        pressAction: {
          id: 'default'
        }
      }
    })
  }
  
  return(
    <View style={styles.container}>
      <Text>Hello, World!</Text>
      <Button 
        title='Enviar notificação'
        onPress={handleNotificate}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})