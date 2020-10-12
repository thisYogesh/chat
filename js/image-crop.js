function icrop(img){
    this.$parentEl = img.parentNode
    this.$img = img
    
    this.setOrientation()
    this.createScope()
    this.setEvents()
}

icrop.prototype.setEvents = function(){
    const _this = this
    const cropScope = this.$cropScope
    this.$parentEl.addEventListener('wheel', function(e){
        if(e.deltaY > 0){
            _this.zoomIn()
        }else{
            _this.zoomOut()
        }
    })

    let isdown = false
    cropScope.addEventListener('mousedown', function(){
        isdown = true
    })

    cropScope.addEventListener('mouseup', function(){
        isdown = false
    })

    cropScope.addEventListener('mousemove', function(e){
        if(isdown){
            window.requestAnimationFrame(function(){
                const scopeSize = _this._scopeSize
                const parent = _this.$parentEl
                const pos = parent.getBoundingClientRect()
                const x = e.pageX - pos.x
                const y = e.pageY - pos.y

                _this.setScopePosition(cropScope, x - scopeSize / 2, y - scopeSize / 2)
            })
        }
    })
}

icrop.prototype.zoomIn = function(){

}

icrop.prototype.zoomOut = function(){
    
}

icrop.prototype.createScope = function(){
    const img = this.$img
    const cropScope = $.toDOM(`<div class="main-crop-scope" style="background-image: url('${img.src}')"></div>`)
    this.$cropScope = cropScope
    this.$parentEl.append(cropScope);

    // initial cropScope size
    const scopeSize = 200
    this._scopeSize = scopeSize

    cropScope.style.width = `${scopeSize}px`
    cropScope.style.height = `${scopeSize}px`

    // set initial scope position
    const w = img.clientWidth
    const h = img.clientHeight
    const l = (w/2 - cropScope.clientWidth/2)
    const t = (h/2 - cropScope.clientHeight/2)

    this.setScopePosition(cropScope, l, t)

    cropScope.style.backgroundSize = `${w}px ${h}px`
}

icrop.prototype.setOrientation = function(){
    const img = this.$img
    const isLandcape = img.naturalWidth > img.naturalHeight
    const isPorait = img.naturalHeight > img.naturalWidth

    if(isLandcape) this._oriantation = 'landscape'
    else if(isPorait) this._oriantation = 'portrait'
    else this._oriantation = 'square'

    switch(this._oriantation){
        case 'landscape':
            img.classList.add('--landscape');
            break;
        
        case 'portrait':
            img.classList.add('--portrait');
            break;

        default:
            img.classList.add('--square');
            break;
    }
}

icrop.prototype.setScopePosition = function(el, x, y){
    if(x < 0) x = 0
    if(y < 0) y = 0

    el.style.left = x + 'px'
    el.style.top = y + 'px'

    el.style.backgroundPosition = `${-x}px ${-y}px`
}