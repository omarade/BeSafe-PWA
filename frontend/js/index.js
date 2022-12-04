
// const cacheName="STATIC";
// //Just take into account that the "files" below are request-url's and not filenames perse. So for your root of your website yous should include "./" and if you use my site (or another plain HTML-site) also "index.html". If you use a server-side language and have friendly url's that could be something like "news/this-is-a-newsarticle/".
// const appFiles=[
// 	"../manifest.json",
// 	"./index.js",
// 	"../css/index.css",
//     "index.html"
// ];

registerServiceWorker();


function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // navigator.serviceWorker.getRegistration
        navigator.serviceWorker.register('./service-worker.js', {scope: '/'})
            .then((registering)=>{
                // Registration was successful
                console.log("Browser: Service Worker registration is successful with the scope ", registering.scope);
            })
            .catch((error)=>{
                //The registration of the service worker failed
                console.log("Browser: Service Worker registration failed with the error ", error);
            });
    } else {
        //The registration of the service worker failed
        console.log("Browser: I don't support Service Workers :(");
    }

    //Asking for permission with the Notification API
    // if(typeof Notification!==typeof undefined){ 
    //     //First check if the API is available in the browser
    //     Notification.requestPermission().then(result => { 
    //         //If accepted, then save subscriberinfo in database
    //         if(result==="granted"){
    //             console.log("Browser: User accepted receiving notifications, save as subscriber data!");
    //             navigator.serviceWorker.ready.then(serviceworker => { 
    //                 //When the Service Worker is ready, generate the subscription with our Serice Worker's pushManager and save it to our list

    //                 const VAPIDPublicKey="BLkEYM1j2IB270sOATpqFHxkKNjNExDaRgyzbaTVGJzVOpUp0xpszU9aoZ8j-xrny1hspolIMlOxIP2CvnbbNKE";
    //                 //Option userVisibleOnly is neccesary for Chrome
    //                 const options={applicationServerKey:VAPIDPublicKey,userVisibleOnly:true}
    //                 serviceworker.pushManager.subscribe(options).then(subscription => {
    //                     //POST the generated subscription to our saving script (this needs to happen server-side, (client-side) JavaScript can't write files or databases)
    //                     let subscriberFormData=new FormData();
    //                     subscriberFormData.append("json",JSON.stringify(subscription));
    //                     fetch("data/saveSubscription.php",{method:"POST",body:subscriberFormData});
    //                 });
    //             });
    //         }
    //     }).catch((error)=>{
    //         console.log(error);
    //     });
    // }
}
