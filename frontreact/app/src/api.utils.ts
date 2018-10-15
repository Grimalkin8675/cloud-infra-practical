import axios from 'axios';
import { AxiosPromise } from 'axios';

import config from './config';


export function collections(): AxiosPromise<any> {
    return axios.request({
        url: `http://${config.apiUrl}/${config.dbName}`,
        auth: {
            username: config.apiUsername,
            password: config.apiPassword
        }
    });
}

export function bars(): AxiosPromise<any> {
    return axios.request({
        url: `http://${config.apiUrl}/${config.dbName}/bar`,
        auth: {
            username: config.apiUsername,
            password: config.apiPassword
        }
    });
}
