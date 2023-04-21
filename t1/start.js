// run below code all at once 

/** @type {IDBDatabase} */
let db
let req5 = indexedDB.open('testdb5', 4)
req5.onsuccess = event => {
    console.log('onsuccess called')
    db = event.target.result
    db.onversionchange = () => console.log('version changed')
    addNames()
}

req5.onerror = event => console.error('error occurred', event)

req5.onupgradeneeded = event => {
    db = event.target.result
    console.log('onupgradeneeded')
    const objStore = db.createObjectStore('names', { autoIncrement: true })
}

function addNames() {
    const transaction = db.transaction(['names'], 'readwrite')
    transaction.onerror = evt => {
        console.log('error in transaction', evt)
    }
    transaction.oncomplete = evt => {
        console.log('successfully completed transaction')
    }
    const nameObjectStore = transaction.objectStore('names')

    const nameData = ['Gilbert', 'Jerry', 'Ronald', 'Paul']
    for(const name of nameData) {
        nameObjectStore.add(name)
    }

}