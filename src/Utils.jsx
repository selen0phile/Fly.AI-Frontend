import { getDownloadURL, ref } from 'firebase/storage'
import { storage } from './firebase'

const ttl = 60 * 60 * 1000 // 60 minutes
export const getLocalCached = (key) => {
    const x = 'lc_' + key;
    const t = x + '_time';
    if (localStorage.getItem(x) !== null && localStorage.getItem(t)!==null) {
        const l = parseInt(localStorage.getItem(t))
        if(Date.now() - l > ttl) return null;
        console.log('Cache found -> ' + key);
        return localStorage.getItem(x);
    }
    return null;
}
export const setLocalCached = (key, value) => {
    const x = 'lc_' + key
    const t = x + '_time'
    console.log('Cached -> ' + key);
    localStorage.setItem(x, value)
    localStorage.setItem(t, Date.now().toString())
}
export const getLocal = (key) => {
    const x = 'lc_' + key;
    if (localStorage.getItem(x) !== null) return localStorage.getItem(x);
    return null;
}
export const setLocal = (key, value) => {
    const x = 'lc_' + key
    localStorage.setItem(x, value)
}
export async function getDataFromFile(title, file) {
    const resource = ref(storage, '/problems/' + title + '/' + file)
    if(getLocalCached(title + '_' + file)) return getLocalCached(title + '_' + file)
    try {
        const url = await getDownloadURL(resource)
        const data = await fetch(url)
        const text = await data.text()
        setLocalCached(title + '_' + file, text)
        return text
    }
    catch (err) {
        throw err
    }
}