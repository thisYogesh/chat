const user = {
    selector: '.app-auth',

    init(){
        this.$el = document.querySelector(this.selector)

        const signUp = this.$el.querySelector('#sign-up')
        signUp.addEventListener('click', function(){
            user.createAccount()
        })

        const form = this.$el.querySelector('.app-auth-signup');
        const fields = form.querySelectorAll('.app-form-input');
        
        fields.forEach(el => {
            el.addEventListener('blur', function(){
                const value = this.value
                if(value){
                    el.classList.add('--filled')
                }else{
                    el.classList.remove('--filled')
                }
            })
        })
    },

    createAccount(){
        const form = this.$el.querySelector('.app-auth-signup');
        const fields = form.querySelectorAll('.app-form-input');

        let data = {}
        fields.forEach(el => {
            data[el.name] = el.value
        })

        $.post('/create-user', {
            body: JSON.stringify(data)
        })
        .then(resp => console.log(resp))
    }
}