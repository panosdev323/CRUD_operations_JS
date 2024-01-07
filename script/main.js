const dialog = document.querySelector("#dialogElem");
const title = document.querySelector("#title");
const date = document.querySelector("#date");
const description = document.querySelector("#description");
const events = JSON.parse(localStorage.getItem('events')) || [];
let currentEvent = {};

document.addEventListener("DOMContentLoaded", (event) => {
    appendList();
    showModal();
    closeModal();
    confirmModalClose();
    discard();
    formSubmit();
});

const showModal = () => {
    const addEventBtn = document.querySelector("#addEventBtn");
    addEventBtn.addEventListener("click", () => {
        btnStyle('create');
        dialog.showModal();
    })
}

const closeModal = () => {
    const closeModalBtn = document.querySelector("#closeModal");
    const confirm_dialog = document.querySelector("#confirmDialog");
    closeModalBtn.addEventListener("click", () => {
        if (title.value === '' && date.value === '' && description.value === '') {
            dialog.close();
        } else {
            confirm_dialog.showModal();
        }
    })
}

const confirmModalClose = () => {
    const cancelBtn = document.querySelector("#cancelBtn");
    const confirm_dialog = document.querySelector("#confirmDialog");
    cancelBtn.addEventListener("click", () => {
        confirm_dialog.close();
    })
}

const discard = () => {
    const discardBtn = document.querySelector("#discardBtn");
    const confirm_dialog = document.querySelector("#confirmDialog");
    discardBtn.addEventListener("click", () => {
        dialog.close();
        confirm_dialog.close();
        // clear form values
        dialogForm.reset();
    })
}

const formSubmit = () => {
    const dialogForm = document.querySelector("#dialogForm");
    const created = document.querySelector("#created");
    dialogForm.addEventListener("submit", (e) => {
        const list = document.querySelector("#list");
        // prevent fom from submiting
        e.preventDefault();
        // check if event should be added or edited
        const matched = events.findIndex(event => event.id === currentEvent.id);
        if (matched === -1) {
            // save event
            currentEvent = {
                id: `${title.value.split(' ').join('-')}-${Date.now()}`,
                title: title.value,
                date: date.value,
                description: description.value,
                created: new Date().toLocaleString(),
                updated: null
            };
            events.unshift(currentEvent);
        } else {
            // update event
            currentEvent.title = title.value;
            currentEvent.date = date.value;
            currentEvent.description = description.value;
            currentEvent.created = created.value;
            currentEvent.updated = new Date().toLocaleString();
            events[matched] = currentEvent;
        }
        currentEvent={};
        // save events to localstorage
        localStorage.setItem('events', JSON.stringify(events));
        // if event add it to ui
        appendList();
        // clear form values
        dialogForm.reset();
        // close dialog
        dialog.close();
    })
}

const deleteEvt = (elem) => {
    // get id
    const id = elem.parentElement.id;
    // match id with object id
    const matched = events.findIndex(event => event.id === id);
    if (matched !== -1) {
        if (confirm("Are you sure you want to delete this event?")) {
            elem.parentElement.parentElement.remove();
            events.splice(matched, 1);
            // save events to localstorage
            localStorage.setItem('events', JSON.stringify(events));
        }
    } 
}

const editEvt = (elem) => {
    // get id
    const id = elem.parentElement.id;
    // match id with object id
    const matched = events.findIndex(event => event.id === id);
    const created = document.querySelector("#created");
    if (matched !== -1) {
        // open dialog
        dialog.showModal();
        // input values
        title.value = events[matched].title;
        date.value = events[matched].date;
        description.value = events[matched].description;
        created.value = events[matched].created;
        // update currentEvent
        currentEvent.id = events[matched].id;
        currentEvent.title = events[matched].title;
        currentEvent.date = events[matched].date;
        currentEvent.description = events[matched].description;
        currentEvent.created = events[matched].created;
        currentEvent.updated = events[matched]?.updated ?? null;
        btnStyle('edit');
    } 
}

const btnStyle = (state) => {
    if (state === 'edit') {
        document.querySelector(".addeventdiv > button").innerText='Edit Event';
        document.querySelector(".addeventdiv > button").classList.add("dynamicEditBtn");
    }
    if (state === 'create') {
        document.querySelector(".addeventdiv > button").innerText='Add Event';
        document.querySelector(".addeventdiv > button").classList.remove("dynamicEditBtn");
    }
}

const appendList = () => {
    if (events.length) {
        // empty list
        list.innerHTML = '';
        // add every item to list
        for (let i = 0; i < events.length; i++) {
            list.innerHTML += `
                <article>
                    <ul class="lists">
                        <li><b>Title</b>: ${events[i]?.title}</li>
                        <li><b>Date</b>: ${events[i]?.date}</li>
                        <li><b>Description</b>: ${events[i]?.description}</li>
                    </ul>
                    <div id="${events[i].id}" style='padding-top:10px;padding-left:10px;'>
                        <button class="btnevt" onclick="editEvt(this)">Edit</button>
                        <button class="btnevt" onclick="deleteEvt(this)">Delete</button>
                    </div>
                    <div class='createdUpdated'>
                        <span>Created: ${events[i].created}</span>
                        ${events[i]?.updated ? `<span>Updated: ${events[i].updated}</span>` : ""}
                    </div>
                </article>
            `;
        }
        // show list
        list.classList.remove('d-none');
    }
}