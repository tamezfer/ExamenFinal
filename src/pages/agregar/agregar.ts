import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ImagenPage } from '../imagen/imagen';

import * as firebase from 'firebase';
import 'firebase/auth'
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Geolocation} from '@ionic-native/geolocation'; 
import 'firebase/storage';
import 'firebase/firestore';

/**
 * Generated class for the AgregarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-agregar',
  templateUrl: 'agregar.html',
})
export class AgregarPage {
  ImagenPage = ImagenPage;

  comentario = '';

  Tipo = '';
  Copa = '';
  Tronco = '';

  imagen;
  latitud = 0;
  longitud = 0;

  storage: firebase.storage.Storage;
  db: firebase.firestore.Firestore;
  user: firebase.User;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public alertCtrl: AlertController, public camera: Camera, 
    private geolocation: Geolocation, public loading: LoadingController) {
    this.db = this.navParams.get('db');
    this.user = firebase.auth().currentUser;
    this.imagen = this.navParams.get('imagen');
    this.storage = firebase.storage();
    this.db = firebase.firestore();
    this.user = firebase.auth().currentUser;
  }

  getPicture()
  {
    console.log('tomar foto');

    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitud=resp.coords.latitude
      this.longitud=resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options)
    .then(imagen => {
      console.log('imagen capturada');
     this.imagen = 'data:image/jpeg;base64,' + imagen;
    }, error => {
      console.log(JSON.stringify(error));
    });
}

  

addDocument(collection: string, obj: any){
  this.db.collection(collection).add(obj)
  .then((res) =>{
    console.log('agregado');
    let alert = this.alertCtrl.create(
      {
        title: "Éxito",
        subTitle: "Se agregó el árbol a tu bosque",
        buttons: ["OK"]
      }
    );
    alert.present();
  })
  .catch((error) => {
    console.log('error');
    let alert = this.alertCtrl.create(
      {
        title: "Error",
        subTitle: "No se pudo agregar el árbol a la colección.",
        buttons: ["Ok"]
      }
    );
    alert.present();
  });
}

ionViewDidLoad() {
  console.log('ionViewDidLoad AgregarPage');
}

Agregar(){
  let loading = this.loading.create({
    content: "Subiendo Imagen..."
  });
  loading.present();

  console.log(this.Tipo,
            this.Tronco,
            this.Copa);
  let arbol = {
    tipo: this.Tipo,
    copa: this.Copa,
    tronco: this.Tronco,
    latitud: this.latitud,
    longitud: this.longitud,
    user: this.user.uid
  }
  this.db.collection('arboles').add(arbol)
    .then(ref => {
      let imagenNombre = ref.id;

      
    let uploadTask = 
    this.storage.ref('arboles/' + imagenNombre + '.jpg')
    .putString(this.imagen, 'data_url');

    uploadTask.then( out => {
      loading.dismiss();
      let url = out.downloadURL;
      ref.update({url: url});
      this.navCtrl.pop();
    })
    .catch(error => {
      console.log('error al subir la imagen');
    });
    });
}

}
