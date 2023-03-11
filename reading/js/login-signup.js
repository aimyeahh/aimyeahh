async function onclickSignup (){
    try{
      let conf = confirmpass.value
      let pass = signuppassid.value
      if(conf == pass){
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json"
           }
           
           let bodyContent = JSON.stringify({
             "username" : signupid.value+'',
             "password" : signuppassid.value+''
           });
           
           let response = await fetch(localStorage.getItem(ip)+"/api/signup", { 
             method: "POST",
             body: bodyContent,
             headers: headersList
           });
           
           let data = await response.json();
           console.log(data);
          //  {"msg":"success","code":0}
           if(data.msg == "success" && data.code == 0 ){
            alert('login success')
            setTimeout(()=>{
              window.location.href = './login.html'
            },500)
           }
          }else{
            console.log('password and confirm password not match')
            // alert('password and confirm password not match')
            alert_text.style.visibility = "visible" 
            alert_text.innerText = 'password and confirm password not match'
            setTimeout(()=>{
              // alert_text.style.visibility = "hidden" 
            },3000)
          }
    }catch(err){
        console.log(err)
    }
    
       
}