import * as admin from "firebase-admin";

const app = admin.initializeApp({
  credential: admin.credential.cert("serviceAccount.json"),
  databaseURL: "https://fcm-shop-demo.firebaseio.com"
});

const db = app.database();

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startOrderProcessing(orderKey, order) {
  let orderStateRef = db.ref(`/orders/${orderKey}/state`);

  await timeout(10000);

  await Promise.all([
    orderStateRef.set('processing'),
  ]);

  await timeout(20000);

  await Promise.all([
    orderStateRef.set('shipping_transfer'),
  ]);

  await timeout(30000);

  await Promise.all([
    orderStateRef.set('shipping_success'),
  ]);
}

db.ref("/orders").on('child_added', (snapshot) => {
  let orderKey = snapshot.key;
  let order = snapshot.val();
  if (order.state === 'new') {
    startOrderProcessing(orderKey, order)
  }
});