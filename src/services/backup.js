// ../../services/backup.js
import api from '../libs/api';

export const getBackups = () => {
    return new Promise((resolve, reject) => {
        api()
            .get('/backups')
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
};

export const getFile = (filename) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/backups/download/${filename}`, {
                responseType: 'blob',
            })
            .then((response) => {
                if (response.status === 200) resolve(response); // Resolve the entire response
                throw new Error(`Failed with status: ${response.status}`);
            })
            .catch(error => reject(error));
    });
};
// ... (other backup-related functions can be exported here)