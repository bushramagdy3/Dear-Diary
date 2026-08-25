
export function getAppData(){
    return new Promise((resolve, reject) => {
        const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB
        const request = indexedDB.open('DearDiaryDataBase', 1)
        request.onerror = function (event) {
            reject(event)
        }
        request.onupgradeneeded = function () {
            const db = request.result
            if(!db.objectStoreNames.contains('AppData')){
                const AppDataStore = db.createObjectStore('AppData', {keyPath: 'name'})
                AppDataStore.put({name: "appData", diaries: [], people: []})
            }
            if(!db.objectStoreNames.contains('Images')){
                db.createObjectStore('Images', {keyPath: 'id'})
            }    
        }
        request.onsuccess = function () {
            const db = request.result
            const transaction = db.transaction('AppData', 'readonly')
            const appDataStore = transaction.objectStore('AppData')
            const getRequest = appDataStore.get('appData')
            getRequest.onerror = function (event){
                reject(event)
            }
            getRequest.onsuccess = function () {
                resolve(getRequest.result)
            }
        }
    })
}

export function saveAppData(appData){
    return new Promise((resolve, reject) => {
        const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB
        const request = indexedDB.open('DearDiaryDataBase', 1)
        request.onerror = function (event) {
            reject(event)
        }
        request.onupgradeneeded = function () {
            const db = request.result
            if(!db.objectStoreNames.contains('AppData')){
                const AppDataStore = db.createObjectStore('AppData', {keyPath: 'name'})
                AppDataStore.put(appData)
            }
            if(!db.objectStoreNames.contains('Images')){
                db.createObjectStore('Images', {keyPath: 'id'})
            }    
        }
        request.onsuccess = function () {
            const db = request.result
            const transaction = db.transaction('AppData', 'readwrite')
            const appDataStore = transaction.objectStore('AppData')
            const putRequest = appDataStore.put(appData)
            putRequest.onerror = function (event){
                reject(event)
            }
            putRequest.onsuccess = function () {
                resolve("Success")
            }
        }
    })
}

export function addImage(image){
    return new Promise((resolve, reject) => {
        const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB
        const request = indexedDB.open('DearDiaryDataBase', 1)
        request.onerror = function (event) {
            reject(event)
        }
        request.onupgradeneeded = function () {
            const db = request.result
            if(!db.objectStoreNames.contains('AppData')){
                db.createObjectStore('AppData', {keyPath: 'name'})
            }
            if(!db.objectStoreNames.contains('Images')){
                db.createObjectStore('Images', {keyPath: 'id'})
            }    
        }
        request.onsuccess = function () {
            const db = request.result
            const transaction = db.transaction('Images', 'readwrite')
            const imagesStore = transaction.objectStore('Images')
            const putRequest = imagesStore.put(image)
            putRequest.onerror = function (event){
                reject(event)
            }
            putRequest.onsuccess = function () {
                resolve(`Image saved successfully with id ${image.id}`)
            }
        }
    })
}

export function getBlobById(imageId){
    return new Promise((resolve, reject) => {
        const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB
        const request = indexedDB.open('DearDiaryDataBase', 1)
        request.onerror = function (event) {
            reject(event)
        }
        request.onupgradeneeded = function () {
            const db = request.result
            if(!db.objectStoreNames.contains('AppData')){
                db.createObjectStore('AppData', {keyPath: 'name'})
            }
            if(!db.objectStoreNames.contains('Images')){
                db.createObjectStore('Images', {keyPath: 'id'})
            }    
        }
        request.onsuccess = function () {
            const db = request.result
            const transaction = db.transaction('Images', 'readonly')
            const imagesStore = transaction.objectStore('Images')
            const getRequest = imagesStore.get(imageId)
            getRequest.onerror = function (event){
                reject(event)
            }
            getRequest.onsuccess = function () {
                resolve(getRequest.result.blob)
            }
        }
    })
}