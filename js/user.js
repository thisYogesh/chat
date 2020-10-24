const user = {
    selector: '.app-auth',

    init(){
        const _this = this
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
                if(value) el.classList.add('--filled')
                else el.classList.remove('--filled')
            })
        })

        const profileUpload = this.$el.querySelector('.main-profile-upload')
        profileUpload.addEventListener('change', function(e){
            const file = this.files[0]
            if(file){
                const fileReader = new FileReader()
                fileReader.onload = function(e){
                    _this.onProfileImageSelect(e.target.result)
                }
                fileReader.readAsDataURL(file)
            }
        })

        const cancelCrop = this.$el.querySelector('.cancel-croping')
        cancelCrop.addEventListener('click', function(){
            const cropper = _this.$$profileCrop
            if(cropper) {
                cropper.destroy()
                
                const profileImage = _this.$el.querySelector('.profile-image')
                profileImage.classList.remove('hide')

                const profileImageCrop = _this.$el.querySelector('.profile-image-crop')
                profileImageCrop.classList.add('hide')
            }
        })

        const getCropValue = this.$el.querySelector('.get-crop-value')
        getCropValue.addEventListener('click', function(){
            const cropper = _this.$$profileCrop
            const image = cropper.getCropData()
            cropper.alignScopeInCenter()
            setTimeout(function(){
                cropper.destroy()

                const profileImage = _this.$el.querySelector('.profile-image')
                profileImage.classList.remove('hide')

                const profileImageCrop = _this.$el.querySelector('.profile-image-crop')
                profileImageCrop.classList.add('hide')

                const img = _this.$el.querySelector('.main-profile-image')
                img.src = image
            }, 700)
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
    },

    onProfileImageSelect(base64){
        let height, width, _this = this;

        const profileImage = this.$el.querySelector('.profile-image')
        profileImage.classList.add('hide')

        const profileImageCrop = this.$el.querySelector('.profile-image-crop')
        profileImageCrop.classList.remove('hide')

        const image = new Image()
        image.onload = function(){
            this.classList.add('main-crop-image')

            height = this.naturalHeight
            width = this.naturalWidth

            const cropArea = _this.$el.querySelector('.main-crop-area')

            // set oriantation
            if(height > width) this.classList.add('--portrait')
            else if(width > height) this.classList.add('--landscape')
            else this.classList.add('--squared')
            
            cropArea.append(this)
            _this.$$profileCrop = new icrop(this)
        }
        image.src = base64
    }
}