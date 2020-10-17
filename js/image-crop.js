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
        e.preventDefault()
        if(e.deltaY > 0){
            _this.zoomIn(e)
        }else{
            _this.zoomOut(e)
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
                const pos = _this.calcPosition(e)
                _this.setScopePosition(cropScope, pos.left, pos.top)
            })
        }
    })
}

icrop.prototype.zoomIn = function(e){
    const pos = this.calcPosition(e)
    const size = this._scopeSize - 5
    this.setScope(size, pos.left, pos.top)
}

icrop.prototype.zoomOut = function(e){
    const pos = this.calcPosition(e)
    const size = this._scopeSize + 5
    this.setScope(size, pos.left, pos.top)
}

icrop.prototype.calcPosition = function(e){
    const s = this._scopeSize / 2
    const pos = this.$parentEl.getBoundingClientRect()

    return {
        left: (e.pageX - pos.x) - s,
        top: (e.pageY - pos.y) - s
    }
}

icrop.prototype.createScope = function(){
    const img = this.$img
    const cropScope = $.toDOM(`<div class="main-crop-scope" style="background-image: url('${img.src}')"></div>`)
    this.$cropScope = cropScope
    this.$parentEl.append(cropScope);

    // initial cropScope size
    const scopeSize = 200
    this._scopeSize = scopeSize
    this._smallScopeSize = 70
    this._largerScopeSize = 200

    // set initial scope position
    const w = img.clientWidth
    const h = img.clientHeight
    const dv = scopeSize/2
    const l = (w/2 - dv)
    const t = (h/2 - dv)

    this.setScope(scopeSize, l, t)
    cropScope.style.backgroundSize = `${w}px ${h}px`
}

icrop.prototype.setScope = function(size, l, t){
    // set crop size
    const cropScope = this.$cropScope
    this._scopeSize = size

    // set size limit
    if(size > this._largerScopeSize) this._scopeSize = this._largerScopeSize
    else if(size < this._smallScopeSize) this._scopeSize = this._smallScopeSize
    else this._scopeSize = size

    cropScope.style.width = `${this._scopeSize}px`
    cropScope.style.height = `${this._scopeSize}px`

    this.setScopePosition(cropScope, l, t)
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