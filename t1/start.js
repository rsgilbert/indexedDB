// run below code all at once 

/** @type {IDBDatabase} */
let db
let req5 = indexedDB.open('testdb5', 3)
req5.onsuccess = event => {
    console.log('onsuccess called')
    db = event.target.result
    db.onversionchange = () => console.log('version changed')
    addMoreCustomers()
}

req5.onerror = event => console.error('error occurred', event)

const customerData = [
    { idNo: '123', name: 'James', email: 'g@m.com' },
    { idNo: '567', name: 'Peter', email: 'p@m.com' }
]

req5.onupgradeneeded = event => {
    db = event.target.result
    console.log('onupgradeneeded')
    const objStore = db.createObjectStore('customers', { keyPath: 'idNo' })
    objStore.createIndex('name', 'name', { unique: false })
    objStore.createIndex('email', 'email', { unique: true })

    // use transaction oncomplete to make sure the object store creation is finished before adding data into it 
    objStore.transaction.oncomplete = evt => {
        const customerObjectStore = db.transaction('customers', 'readwrite').objectStore('customers')

        for (const data of customerData) {
            customerObjectStore.add(data)
        }
    }
}

function addMoreCustomers() {
    console.log('adding')
    const transaction = db.transaction(['customers'], 'readwrite')
    transaction.onerror = evt => {
        console.log('error in addMoreCustomers transaction', evt)
    }
    transaction.oncomplete = evt => {
        console.log('successfully completed addMoreCustomers transaction')
    }
    // console.log(transaction)
    const customersObjectStore = transaction.objectStore('customers')

    customersObjectStore.add({
        idNo: '700',
        name: 'Kwire',
        email: 'kimigu',
        address: 'Kanyanya'
    })
    customersObjectStore.add({ 
        idNo: 800,
        name: 'Peterson',
        email: 'ps@mail.co',
        address: 'Nsambya'
    }),
    
   
}


// perform transaction

// runAfterDelay(() => {
//     console.log(db)
//     let transaction = db.transaction(['insects'], 'readwrite')

//     transaction.oncomplete = event => console.log('all done')

//     transaction.onerror = event => console.error('error occurred in transaction')

//     const objStore = transaction.objectStore('insects')

//     let request0 = objStore.add('Butterfly')
//     request0.onsuccess = event => {
//         console.log('successfully added item', event)
//     }
// })


async function runAfterDelay(fn, t = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                fn()
                resolve()
            }
            catch (e) { reject(e) }
        }, t)
    })
}




