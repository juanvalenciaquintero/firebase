import { Component, OnInit } from '@angular/core';
import
  {
    ActionPerformed, PushNotifications, PushNotificationSchema, Token
  } from '@capacitor/push-notifications';
import { FirestoreService } from '../firestore.service';
import { Tokens } from '../tokens';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  token: Tokens;
  constructor(private firestoreService: FirestoreService) {
    this.token = {} as Tokens;
   }

  ngOnInit() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting

     PushNotifications.requestPermissions().then(result => {
      console.log('Result: ' + JSON.stringify(result));
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
        PushNotifications.addListener('registrationError',(error: any) => {
      console.log('Push registration error, error: ' + JSON.stringify(error));
    });
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log(token.value);
      this.token.token = token.value;
      this.insertar();
      // alert('Push registration success, token: ' + token.value);
      console.log(token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      },
    );

  }

  insertar() {
    this.firestoreService.insertar('tokens', this.token).then(() => {
      console.log('Token guardado correctamente!');
      this.token= {} as Tokens;
    }, (error) => {
      console.error(error);
    });

  }
}
