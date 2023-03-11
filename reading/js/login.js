async function loginbyaim() {
  try {
    let headersList = {
      "Accept": "*/*",
      "Content-Type": "application/json"
    }

    let bodyContent = JSON.stringify({
      "username": usernameid.value + '',
      "password": passwordid.value + ''
    });

    let response = await fetch(ip_address_localhost + "/api/login", {
      method: "POST",
      body: bodyContent,
      headers: headersList
    });

    let data = await response.json();
    console.log(data);
    if(data.msg == 'login'){
      let token = data.token
      localStorage.setItem('token','')
      localStorage.setItem('token',token);
      window.location.href = './home.html'
    }else{
      alert('something wrong')
    }

  } catch (err) {
    alert('something wrong')
    console.log(err);
  }
}