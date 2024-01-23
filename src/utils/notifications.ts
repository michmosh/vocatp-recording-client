export const options = {
    title: 'Recording In Progress',
    subtitle: 'Recoridng In Progress', //optional
    message: 'Notification: Your Recorder App is working and recording', //optional
    onClick: (e: Event | Notification) => {
        debugger
    }, //optional, onClick callback.
    // theme: 'red', //optional, default: undefined
    duration: 300000, //optional, default: 5000,
    // backgroundTop: 'green', //optional, background color of top container.
    // backgroundBottom: 'darkgreen', //optional, background color of bottom container.
    // colorTop: 'green', //optional, font color of top container.
    // colorBottom: 'darkgreen', //optional, font color of bottom container.
    closeButton: 'Go away', //optional, text or html/jsx element for close text. Default: Close,
    native: true, //optional, makes the push notification a native OS notification
    icon: './assets/img/audiocodes-logo-colored.svg', // optional, Native only. Sets an icon for the notification.
    // vibrate: 1000, // optional, Native only. Sets a vibration for the notification.
    silent: true // optional, Native only. Makes the notification silent.

};

export class PushNotification{
    static isShow= false
    static onClick = ()=>{
        
    }
    static onClose = ()=>{
        
    }
    static sendNotification = async ()=>{
        if (Notification.permission === 'default' || Notification.permission === 'denied') {
            await Notification.requestPermission();
        }
        if (Notification.permission === 'granted') {
            const not: Notification = new Notification("TEST NOTIFICATION", {
                body: "YOUR RECORDER APP IS RECORDING ",
                data: "NOTIFICITATION SUBTITLE",
                icon:'../assets/img/audiocodes-logo-colored.svg',
                // vibrate,
                silent:true,
                image:'../assets/img/audiocodes-logo-colored.svg',
               requireInteraction: true
            });
            not.onclick = this.onClick
            not.onclose = ()=>{
               not.close()
            }
            not.onshow = ()=>{
                
            }
            console.log(not)
            return not
        }
    }
    
    
}

export default PushNotification