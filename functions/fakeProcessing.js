"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const admin = require("firebase-admin");
const app = admin.initializeApp({
    credential: admin.credential.cert("serviceAccount.json"),
    databaseURL: "https://fcm-shop-demo.firebaseio.com"
});
const db = app.database();
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function startOrderProcessing(orderKey, order) {
    return __awaiter(this, void 0, void 0, function* () {
        let orderStateRef = db.ref(`/orders/${orderKey}/state`);
        yield timeout(10000);
        yield Promise.all([
            orderStateRef.set('processing'),
        ]);
        yield timeout(20000);
        yield Promise.all([
            orderStateRef.set('shipping_transfer'),
        ]);
        yield timeout(30000);
        yield Promise.all([
            orderStateRef.set('shipping_success'),
        ]);
    });
}
db.ref("/orders").on('child_added', (snapshot) => {
    let orderKey = snapshot.key;
    let order = snapshot.val();
    if (order.state === 'new') {
        startOrderProcessing(orderKey, order);
    }
});
//# sourceMappingURL=fakeProcessing.js.map