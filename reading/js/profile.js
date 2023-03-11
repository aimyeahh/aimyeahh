<script src="./global.js"></script>
console.log(ip_address_localhost)
getprofile()
async function getprofile() {
  let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
  }

  let bodyContent = JSON.stringify({
    "token": localStorage.getItem('token')
  });

  let response = await fetch("http://192.168.1.53:3000/api/profile", {
    method: "POST",
    body: bodyContent,
    headers: headersList
  });

  let data = await response.json();
  if(data.msg == "success"){
    let user = data.decoded.username
    localStorage.setItem('user',user)
  }else{
    window.location.href = './login.html'
  }
}
