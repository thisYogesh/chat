const $ = {
    get(url){
        return this.fetch(url)
    },
    
    post(url, options){
        options = {
            method: 'POST',
            ...options
        }

        return this.fetch(url, options)
    },

    fetch(url, options){
        return new Promise(function(responce, reject){
            fetch(url, options).then(resp => {
                resp
                .json()
                .then(json => {
                    responce(json)
                })
                .catch((e) => {
                    reject(e)
                })
            })
            .catch((e) => {
                reject(e)
            })
        })
    },

    toDOM(html){
        const parser = new DOMParser()
        const dom = parser.parseFromString(html, 'text/html')
        return dom.body.children[0]
    }
}