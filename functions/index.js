const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var Nexmo = require('nexmo');
var aesjs = require('aes-js');



exports.SMS = functions.https.onRequest((request, response) => {
 

    console.log("This is the function");
    console.log(request.body);
    var json = JSON.parse(request.body);

    const phone = json.phone;

    console.log(phone);

  //   var phoneno = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  //   console.log("here"+(phone.match(phoneno)));
  
  //   if((phone.match(phoneno))){  
  //       console.log("Matched");

        const nexmo = new Nexmo({
		  apiKey: 'b0580eb4',
		  apiSecret: '46872c23e22e7a59'
		});


      const from = '12017016978';
	   	const to = phone;
	  	const text = 'Thank You for using TPV Express. Please use the following link to download our voice-enabled Android app for Third Party Verification.  https://play.google.com/store/apps/details?id=com.patientdatascience.tpvexpress&hl=en';

      nexmo.message.sendSms(from, to, text, (error, res) => {
		  if(error) {
		    // throw error;
		    console.log(error);
		    response.json({success: false,data: error});
          } else if(res.messages[0].status != '0') {
		    console.error(res);
		    response.json({success: false,data: res});
		    // throw 'Nexmo returned back a non-zero status';
		  } else {
		    console.log(res);
		    response.json({success: true,data: res});
		    
		  }
		});

		
		// var dataString = 'api_key=cf87e726&api_secret=8a8300980b7d252c&to=923455307718&from=NEXMO&text=Hello from Nexmo';

		// var options = {
		//     url: 'https://rest.nexmo.com/sms/json',
		//     method: 'POST',
		//     body: dataString
		// };

		// function callback(error, res, body) {
	 //        if(error){
  //             response.json({success: false,data: error});
  //           }

		//     if (!error && res.statusCode == 200) {
		//         response.json({success: true,data: res});
		//     }
		// }

		// req(options, callback);

        

		// var dataString = 'from=12017016978&text=A text message sent using the Nexmo SMS API&to=03455307718&api_key=b0580eb4&api_secret=46872c23e22e7a59';

		// var options = {
		//     url: 'https://rest.nexmo.com/sms/json',
		//     method: 'POST',
		//     body: dataString
		// };

		// function callback(error, res, body) {
  //           if(error){
  //           	response.json({success: false,data: error});
  //           }

		//     if (!error && res.statusCode == 200) {
		//         response.json({success: true,data: res});
		//     }
		// }

		// req(options, callback);

     //  }  
     //  else{  
     //    console.log("Didn't match")
     //    response.json({success: false,data: "Invalid Phone number"});
		    
     // }  
   

});


exports.userData = functions.https.onRequest((request,response)=>{

   
      admin.database().ref("customers").once("value",function(snapShot){
    	
    	 response.json({success: true,data: snapShot.val()});

    	})
});



exports.decrypt = functions.https.onRequest((request,response)=>{
   
  
      // var password = request.body.password;
      // var customerData = request.body.customerData;
      var json = JSON.parse(request.body);
      
      console.log(json.customerData);
      var customerData = json.customerData;
      console.log(customerData);
      customerData.splice(0,2);
      console.log(customerData);
      //DO STUFF WITH PASSWORD HERE
      // if(password == "123qwe"){
          // console.log("correct password");
          var key_raw = "blueTapalyellow!";
          var iv = "786125zipabc5431";
          var key_crypt = aesjs.utils.utf8.toBytes(key_raw);
          var iv_crypt = aesjs.utils.utf8.toBytes(iv);
          var decryptedBytes;
          try{
           var customerDataDecrypted = [];
           var encryptedBytes_SSN;
           var aesCbc;
           var decryptedText;
           
           for (var i = 0; i < 5; i++) {
            if (customerData[i] == 'undefined') {continue;}
             encryptedBytes_SSN = aesjs.utils.hex.toBytes(customerData[i]);
             aesCbc = new aesjs.ModeOfOperation.cbc(key_crypt, iv_crypt);
             decryptedBytes = aesCbc.decrypt(encryptedBytes_SSN);
             decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
             customerDataDecrypted[i] = decryptedText;
           }
           response.json({success: true,data: customerDataDecrypted});
         }
         catch(err){
            
            response.json({success: false,data: err});

         }
      // }else{
      //   response.json({success: false,data: "Wrong password"});
      // }
  

});
