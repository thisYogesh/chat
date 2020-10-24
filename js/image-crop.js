function icrop(img){
    this._lockScope = false
    this.$parentEl = img.parentNode
    this.$img = img

    this.createScope()
    this.setEvents()
}

icrop.prototype.setEvents = function(){
    const _this = this
    const cropScope = this.$cropScope
    this.$parentEl.addEventListener('wheel', function(e){
        e.preventDefault()

        if(e.deltaY > 0)_this.zoomIn(e)
        else _this.zoomOut(e)
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
    const cropScope = $.toDOM(`<div class="main-crop-scope --fast-transition" style="background-image: url('${img.src}')"></div>`)
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
    this._cropArea = { width: w, height: h }

    this.setScope(scopeSize, l, t)
    cropScope.style.backgroundSize = `${w}px ${h}px`
}

icrop.prototype.alignScopeInCenter = function(){
    // lock scope movement
    this._lockScope = true
    
    const cropArea = this._cropArea
    const dv = this._scopeSize/2
    const l = (cropArea.width/2 - dv)
    const t = (cropArea.height/2 - dv)

    const cropScope = this.$cropScope.classList
    cropScope.remove('--fast-transition')
    cropScope.add('--slow-transition')
    this.$parentEl.classList.add('--white-bg')
    
    this.setScopePosition(this.$cropScope, l, t)
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
    const cropArea = this._cropArea

    if(x < 0) x = 0
    else if(x + this._scopeSize > cropArea.width){
        x = cropArea.width - this._scopeSize
    }

    if(y < 0) y = 0
    else if(y + this._scopeSize > cropArea.height){
        y = cropArea.height - this._scopeSize
    }

    el.style.left = x + 'px'
    el.style.top = y + 'px'

    if(!this._lockScope) el.style.backgroundPosition = `${-x}px ${-y}px`
}

icrop.prototype.getCropData = function(){
    const canvas = document.createElement('canvas');
    const croppedData = this.$cropScope.style

    const width = this._cropArea.width
    const height = this._cropArea.height

    canvas.width = width
    canvas.height = height

    const cx = canvas.getContext('2d')
    cx.drawImage(this.$img, 0, 0, width, height)

    const left = parseFloat(croppedData.left)
    const top = parseFloat(croppedData.top)
    const size = this._scopeSize
    const idata = cx.getImageData(left, top, size, size)

    // generating image
    cx.clearRect(0, 0, width, height)
    canvas.width = canvas.height = size
    cx.putImageData(idata, 0, 0)
    
    return canvas.toDataURL();
}

icrop.prototype.destroy = function(){
    this.$img.remove();
    this.$cropScope.remove()
    this.$parentEl.classList.remove('--white-bg')
}