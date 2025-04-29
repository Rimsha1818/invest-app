import api from '../libs/api';

export default {

  getComments: (id, form_id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/comments?key=${id}&form_id=${form_id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postComments: (data) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

    // Append other data to formData 
    for (const key in data) {
      if (key !== 'attachment') { // Don't add attachment here
        formData.append(key, data[key]); 
      }
    }

    // Conditionally append the file ONLY if it exists
    if (data.attachment && data.attachment.size > 0) {  
      formData.append('attachment', data.attachment);
    }
      api()
        .post('/comments', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(({ status, data }) => {
          if (status === 201) {
            resolve(data);
          }
        })
        .catch(error => reject(error));
    });
  },

  updateCommentStatus: (data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
        api()
            .put(`/enable-disable-comments`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
  

   getCommentsNonForm: (id, form_id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/comments-non-form?key=${id}&non_form_id=${form_id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postCommentsNonForm: (data) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

    // Append other data to formData 
    for (const key in data) {
      if (key !== 'attachment') { // Don't add attachment here
        formData.append(key, data[key]); 
      }
    }

    // Conditionally append the file ONLY if it exists
    if (data.attachment && data.attachment.size > 0) {  
      formData.append('attachment', data.attachment);
    }
      api()
        .post('/comments-non-form', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(({ status, data }) => {
          if (status === 201) {
            resolve(data);
          }
        })
        .catch(error => reject(error));
    });
  },

  updateCommentStatusNonForm: (data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
        api()
            .put(`/enable-disable-comments-non-form`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

}