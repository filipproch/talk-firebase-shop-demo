import {DeltaSnapshot} from "firebase-functions/lib/providers/database";
import {Event} from "firebase-functions";
import * as admin from "firebase-admin";

export async function notifyOrderStatusChanged(event: Event<DeltaSnapshot>) {
  const status = event.data.val()
  const orderSnap = await event.data.ref.parent.once('value')
  const order = orderSnap.val()

  const user = (await admin.database().ref(`/users/${order.user}`).once('value')).val()

  if (user.fcmToken) {
    const payload = {
      data: {
        order: orderSnap.key,
        state: status
      }
    }
    await admin.messaging().sendToDevice(user.fcmToken, payload)
  }
}

export async function processNewOrder(event: Event<DeltaSnapshot>) {
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}