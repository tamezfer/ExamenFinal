import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { Camera, CameraOptions, DestinationType} from '@ionic-native/camera';
import { ImagenPage } from '../imagen/imagen';

import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { AgregarPage } from '../agregar/agregar';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  db: firebase.firestore.Firestore;
  items=[];
  user: firebase.User;
  agregarPage = AgregarPage;

  constructor(public navCtrl: NavController,
    public camera: Camera) {
      this.user = firebase.auth().currentUser;
      this.db = firebase.firestore();

 //     this.getDocuments('arboles');
  }

  ionViewDidEnter(){
    this.items=[];
    this.getDocuments('arboles');
  }

  getDocuments(collection: string)
  {
    this.db.collection(collection).where('user', '==', this.user.uid).get()
      .then(res=> {
        res.forEach((doc: any)=>{
          let dict={
            'tipo': doc.data().tipo,
            'copa': doc.data().copa,
            'tronco': doc.data().tronco,
            'latitud': doc.data().latitud,
            'longitud': doc.data().longitud,
            'url': doc.data().url,
          }
          this.items.push(dict);
        });
        })
        .catch((error: any)=>{
          console.log(JSON.stringify(error));
        })
  }

AddArbol()
  {
    console.log('addArbol');
    this.navCtrl.push(this.agregarPage,{db:this.db});
  }

}
