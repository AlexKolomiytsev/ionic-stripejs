import { Storage } from "@ionic/storage";

var storage = new Storage();
storage.create();

export const createStore = () => {

    storage = new Storage();

    storage.create();
}


export const set = (key: string, val: any) => {

    storage.set(key, val);
}

export const get = async (key: string) => {

    const val = await storage.get(key);
    return val;
}

export const remove = async (key: string) => {

    await storage.remove(key);
}

export const clear = async () => {

    await storage.clear();
}

export const setObject = async (key: string, id: number, val: any) => {

    const all = await storage.get(key);
    const objIndex = await all.findIndex((a: any) => {return parseInt(a.id) === id;});

    all[objIndex] = val;
    set(key, all);
}

export const removeObject = async (key: string, id: number) => {

    const all = await storage.get(key);
    const objIndex = await all.findIndex((a: any) => {return parseInt(a.id) === id;});

    all.splice(objIndex, 1);
    set(key, all);
}

export const getObject = async (key: string, id: number) => {

    const all = await storage.get(key);
    const obj = await all.filter((a: any) => {return parseInt(a.id) === id;})[0];
    return obj;
}
