// window.addEventListener('load', () => {
// 	const form = document.querySelector("#new-plan-form");
// 	const input = document.querySelector("#new-plan-input");
// 	const list_el = document.querySelector("#plans");

// 	form.addEventListener('submit', (e) => {
// 		e.preventDefault();

// 		const plan = input.value;

// 		const plan_el = document.createElement('div');
// 		plan_el.classList.add('plan');

// 		const plan_content_el = document.createElement('div');
// 		plan_content_el.classList.add('content');

// 		plan_el.appendChild(plan_content_el);

// 		const plan_input_el = document.createElement('input');
// 		plan_input_el.classList.add('text');
// 		plan_input_el.type = 'text';
// 		plan_input_el.value = plan;
// 		plan_input_el.setAttribute('readonly', 'readonly');

// 		plan_content_el.appendChild(plan_input_el);

// 		const plan_actions_el = document.createElement('div');
// 		plan_actions_el.classList.add('actions');

// 		const plan_edit_el = document.createElement('button');
// 		plan_edit_el.classList.add('edit');
// 		plan_edit_el.innerText = 'edit';

// 		const plan_delete_el = document.createElement('button');
// 		plan_delete_el.classList.add('delete');
// 		plan_delete_el.innerText = 'delete';

// 		plan_actions_el.appendChild(plan_edit_el);
// 		plan_actions_el.appendChild(plan_delete_el);

// 		plan_el.appendChild(plan_actions_el);

// 		list_el.appendChild(plan_el);

// 		input.value = '';

// 		plan_edit_el.addEventListener('click', (e) => {
// 			if (plan_edit_el.innerText.toLowerCase() == "edit") {
// 				plan_edit_el.innerText = "Save";
// 				plan_input_el.removeAttribute("readonly");
// 				plan_input_el.focus();
// 			} else {
// 				plan_edit_el.innerText = "Edit";
// 				plan_input_el.setAttribute("readonly", "readonly");
// 			}
// 		});

// 		plan_delete_el.addEventListener('click', (e) => {
// 			list_el.removeChild(plan_el);
// 		});
// 	});
// })
render()
var todolistdata = ''
function render() {
	fetch("http://localhost:3000/api/todolist", {
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
			let data = await fetch("http://localhost:3000/api/edit/todolist", {
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
		let update = await fetch('http://localhost:3000/api/remove/todolist', {
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
		let data = await fetch("http://localhost:3000/api/insert/todolist", {
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
