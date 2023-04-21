// run below code all at once 

/** @type {IDBDatabase} */
let db
let req5 = indexedDB.open('testdb5', 4)
req5.onsuccess = event => {
    console.log('onsuccess called')
    db = event.target.result
    db.onversionchange = () => console.log('version changed')
    // addNames()
    // getName()
    // getCustomer()
    // updateCustomerEmail("600", 'tt@mail.com')
    // updateCustomerEmail("567", 'mmm@mail.com')
    // updateCustomerEmail("123", 'jj@mail.com')
    // getAllCustomers()
    // getCustomerByEmail('tt@mail.com')
    // countCustomers()
    filterCustomers()
}

req5.onerror = event => console.error('error occurred', event)

req5.onupgradeneeded = event => {
    db = event.target.result
    console.log('onupgradeneeded')
    const objStore = db.createObjectStore('names', { autoIncrement: true })
}

function getAllCustomers() {
    let customers = []
    const customersObjectStore = getCustomersObjectStore('readonly')
    const openCursorRequest = customersObjectStore.openCursor()
    openCursorRequest.onsuccess = evt => {
        const cursor = openCursorRequest.result;
        if (cursor) {
            console.log('pushing customer', cursor.value)
            customers.push(cursor.value);
            cursor.continue()
        }
        else {
            console.log('got all customers', customers)
        }
    }

    // alt - get customers
    const getAllRequest = customersObjectStore.getAll()
    getAllRequest.onsuccess = evt => {
        const custs = getAllRequest.result;
        console.log({ custs })
    }

    // alt - get customer keys
    const getAllKeysRequest = customersObjectStore.getAllKeys()
    getAllKeysRequest.onsuccess = evt => {
        const custKeys = getAllKeysRequest.result;
        console.log({ custKeys })
    }
}

function getCustomerByEmail(email) {
    const customersObjectStore = getCustomersObjectStore('readonly')
    const emailIndex = customersObjectStore.index('email')
    const emailGetRequest = emailIndex.get(email)
    emailGetRequest.onsuccess = evt => {
        const customer = emailGetRequest.result;
        console.log({ customer })
    }
}

function countCustomers() {
    const customersObjectStore = getCustomersObjectStore('readonly')
    const countRequest = customersObjectStore.count()
    countRequest.onsuccess = evt => {
        const customerCount = countRequest.result;
        console.log({ customerCount })
    }
}

function filterCustomers() {
    const customersObjectStore = getCustomersObjectStore('readonly')
    const range = IDBKeyRange.bound('500', '700')
    const getAllRequest = customersObjectStore.getAll(range)
    getAllRequest.onsuccess = evt => {
        console.log({ customers: getAllRequest.result })
    }
}

function getCustomer() {
    const customersObjectStore = getCustomersObjectStore('readonly')
    const getRequest = customersObjectStore.get('567')
    getRequest.error = evt => console.log('failed to get customer')
    getRequest.onsuccess = evt => {
        const data = getRequest.result
        console.table({ data })
    }

}

function updateCustomerEmail(idNo, newEmail) {
    const customersObjectStore = getCustomersObjectStore('readwrite')
    const getRequest = customersObjectStore.get(idNo)
    getRequest.error = evt => console.log('failed to get customer')
    getRequest.onsuccess = evt => {
        const customer = getRequest.result
        console.table({ customer })
        // perform update
        customer.email = newEmail;
        const updateRequest = customersObjectStore.put(customer)
        updateRequest.onerror = evt => {
            console.log('error, failed to update', evt)
        }
        updateRequest.onsuccess = evt => {
            console.log('successfully updated entry')
        }
    }
}

function getName() {
    const transaction = db.transaction(['names'], 'readonly')
    transaction.onerror = evt => {
        console.log('error in transaction', evt)
    }
    transaction.oncomplete = evt => {
        console.log('successfully completed transaction')
    }
    const nameObjectStore = transaction.objectStore('names')
    const getRequest = nameObjectStore.get(19)
    getRequest.error = evt => console.log('failed to get name')
    getRequest.onsuccess = evt => {
        const data = getRequest.result
        console.log({ data })
    }

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
    for (const name of nameData) {
        nameObjectStore.add(name)
    }

    nameObjectStore.delete(14)


}

function getCustomersObjectStore(readmode = 'readonly') {
    const transaction = db.transaction(['customers'], readmode)
    transaction.onerror = evt => {
        console.log('error in transaction', evt)
    }
    transaction.oncomplete = evt => {
        console.log('successfully completed transaction')
    }
    const customersObjectStore = transaction.objectStore('customers')
    return customersObjectStore;
}