/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase/app';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage';
import firebaseConfig from 'src/infrastructure/config/firebase.config';
@Injectable()
export class FirebaseService {
  async uploadFile(file, remoteFilePath: string) {
    const app = firebase.initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const imageRef = ref(storage, remoteFilePath);
    const snapshot = await uploadBytesResumable(
      imageRef,
      file.buffer,
      file.mimetype,
    );
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }

  async deleteFile(filePath: string) {
    const app = firebase.initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const desertRef = ref(storage, `${filePath}`);
    return await deleteObject(desertRef);
  }
}
