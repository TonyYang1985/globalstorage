import store from 'store2';
import Cookies from 'js-cookie';
import EventEmitter from 'eventemitter3';
import _ from 'lodash';

type NS = {
    namespace?: string;
};
const ns: NS = {};
const getKey = (key: string) => (ns.namespace ? `${ns.namespace}:${key}` : key);

export const globalStorage = {
    set namespace(namespace: string) {
        ns.namespace = namespace;
    },
    get namespace() {
        return ns.namespace ?? '';
    },
    events: new EventEmitter(),
    set: (key: string, data: unknown, saveToLS = true) => {
        if (saveToLS) {
            store.set(getKey(key), data);
        }
        Cookies.set(getKey(key), JSON.stringify(data), { sameSite: 'strict' });
    },
    get: <T = unknown>(key: string) => {
        const val = store.get(getKey(key));
        if (_.isEmpty(val)) {
            return JSON.parse(Cookies.get(getKey(key)) ?? 'null');
        }
        return val as T;
    },
    remove: (key: string) => {
        store.remove(getKey(key));
        Cookies.remove(getKey(key), { sameSite: 'strict' });
    },
};
