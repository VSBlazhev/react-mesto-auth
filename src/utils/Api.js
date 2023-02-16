export class Api {
    constructor(options){
        this.baseUrl = options.baseUrl
        this.headers = options.headers
    }

    _checkResponse(res) {
        if (res.ok)
          return res.json();
        else
          return Promise.reject(`Ошибка: ${res.status}`);
      }

    getUserId(){
        return fetch(`${this.baseUrl}/users/me`, {
           headers: this.headers
        })
        .then(this._checkResponse)
    }

    getInitialCards(){
        return fetch(`${this.baseUrl}/cards`, {
            headers: this.headers
        })
        .then(this._checkResponse)
    }

    patchUserInfo({name, description}){
        return fetch(`${this.baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this.headers,
         body: JSON.stringify({
            name: name,
            about: description
          })
        })
         .then(this._checkResponse)
    }

    addNewCard({name,link}){
        return fetch(`${this.baseUrl}/cards`, {
            method: 'POST',
            headers: this.headers,
         body: JSON.stringify({
            name: name,
            link: link
          })
        })
         .then(this._checkResponse)
    }

    deleteCard(id){
        return fetch(`${this.baseUrl}/cards/${id}`, {
            method: 'DELETE',
            headers: this.headers
         })
         .then(this._checkResponse)
    }

    deleteLike(id){
        return fetch(`${this.baseUrl}/cards/${id}/likes`, {
            method: 'DELETE',
            headers: this.headers
         })
         .then(this._checkResponse)
    }

    addLike(id){ 
        return fetch(`${this.baseUrl}/cards/${id}/likes`, {
            method: 'PUT',
            headers: this.headers
         })
         .then(this._checkResponse)
    }

    patchUserAvatar({link}){
        return fetch(`${this.baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this.headers,
         body: JSON.stringify({
            avatar: link
          })
        })
         .then(this._checkResponse)
    }
}

const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-52',
    headers: {
      authorization: 'e4165c1a-5d27-4cba-b52b-e08a233bbb72',
      'Content-Type': 'application/json'
    }
  });

  export default api