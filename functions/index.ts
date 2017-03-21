import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as orderFunctions from "./orderFunctions";

admin.initializeApp(functions.config().firebase)

export let orderStatusChanged = functions
  .database
  .ref('/orders/{orderId}/state')
  .onWrite(event => orderFunctions.notifyOrderStatusChanged(event))

export let newOrderCreated = functions
  .database
  .ref('/orders')
  .onWrite(event => orderFunctions.processNewOrder(event))