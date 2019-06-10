import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import * as firebase from 'firebase';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';
/**
 * Generated class for the ImagenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-imagen',
  templateUrl: 'imagen.html',
})
export class ImagenPage {
  imagen;
  comentario = '';

  storage: firebase.storage.Storage;
  db: firebase.firestore.Firestore;
  user: firebase.User;


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public loading: LoadingController) {
      this.imagen = this.navParams.get('imagen');
      this.storage = firebase.storage();
      this.db = firebase.firestore();
      this.user = firebase.auth().currentUser;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImagenPage');
  }

  subirImagen()
  {
    let loading = this.loading.create({
      content: "Subiendo Imagen..."
    });
    loading.present();



    let imagen = {
      comentario: this.comentario,
      timestamp: 
      firebase.firestore.FieldValue.serverTimestamp(),
      url: '',
      user: this.user.uid
    };

    this.db.collection('imagenes').add(imagen)
    .then(ref => {
      let imagenNombre = ref.id;

      
    let uploadTask = 
    this.storage.ref('imagenes/' + imagenNombre + '.jpg')
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
