importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js')

// const cacheName="site_static";

//assets to cache
// const appAssets = [
//     // "/",
//     "index.html",
// 	"./manifest.json",
// 	"./js/index.js",
// 	"./css/index.css",
//     "./"
// ];

workbox.routing.registerRoute(
    ({req}) => req.destination === 'image', 
    new workbox.strategies.NetworkFirst()
)



self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("Caching shell assets")
            cache.addAll(appAssets)
        })
    )    
})

self.addEventListener("activate", event => {
    console.log("activated")
})

self.addEventListener("fetch", event => {
    console.log("fetched")
})

// self.addEventListener("notificationclick", event => {
//     console.log("Notification clicked")
// })

// self.addEventListener("push", event => {
//     console.log("pushed")
//     if(event.data){
//         pushdata=JSON.parse(event.data.text());		
//         console.log("Service Worker: I received this:",pushdata);
//         if((pushdata["title"]!="") && (pushdata["message"]!="")){			
//             const options={ body: pushdata["message"] }
//             self.registration.showNotification(pushdata["title"], options);
//             console.log("Service Worker: I made a notification for the user");
//         } else {
//             console.log("Service Worker: I didn't make a notification for the user, not all the info was there :(");			
//         }
//     }
// })