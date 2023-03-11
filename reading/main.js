render()
var todolistdata = ''
function render() {
	fetch(localStorage.getItem('ip')+"/api/todolist", {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		body : JSON.stringify({
			token : localStorage.getItem('token')
		})
	}).then((res => res.json())).then(async data => {
		let datalen = data.data.length
		console.log(data.data)
		data = data.data
		todolistdata = data
		let html = ''
		// let addplans = document.getElementById("new-plan-submit")
		for (let i = 0; i < datalen; i++) {
			html += `
				<div class="plan" id = '${data[i].id}'>
						<div class="content">
							<input
								id = 'edit${i}'
								type="text" 
								class="text" 
								value="${data[i].text}"
								readonly>
						</div>
						<div class="actions">
							<button class="edit" onclick="edittodolist(this,edit${i},${data[i].id})">edit</button>
							<button class="delete" onclick = "deletetodolist(this,${data[i].id})">delete</button>
						</div>
					</div> 
				`
		}

		let plans = document.querySelector('#plans')
		plans.innerHTML = html
	}).catch(err => {
		console.log(err)
	})

}
async function edittodolist(editelem, inputelem, idedit) {
	console.log('edit')
	if (editelem.innerText.toLowerCase() == "edit") {
		editelem.innerText = "Save";
		inputelem.removeAttribute("readonly");
		inputelem.focus();


	} else {
		editelem.innerText = "Edit";
		inputelem.setAttribute("readonly", "readonly");
		console.log('editelem',inputelem.value)
		try {
			let data = await fetch(localStorage.getItem('ip')+"/api/edit/todolist", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: JSON.stringify({
					text: inputelem.value,
					planid: idedit
				})
			})
			console.log(await data.json())
			render()
		} catch (err) {
			console.log(err)
		}
	}
}

async function deletetodolist(e, elemplanid) {
	try {
		console.log('deletetodolist')
		let update = await fetch(localStorage.getItem('ip')+'/api/remove/todolist', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify({
				planid: elemplanid
			})
		})
		// console.log(await update.json())
		setTimeout(() => {
			render()
		}, 300)
	} catch (err) {
		console.log('something', err)
	}
}

async function inserttodolist() {
	let valueinsert = document.getElementById('new-plan-input').value
	console.log('xxxx-insert-xxxx', valueinsert)
	try {
		let data = await fetch(localStorage.getItem('ip')+"/api/insert/todolist", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify({
				token : localStorage.getItem('token'),
				text: valueinsert + ""
			})
		})
		console.log(await data.json())
		render()
	} catch (err) {
		console.log(err)
	}

}
