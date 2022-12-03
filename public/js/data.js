let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null,
    scale = 0.7

const canvas = document.getElementById('pdf-render'),
    ctx = canvas.getContext('2d')

const renderPage = num => {
    pageIsRendering = true

    //get page
    pdfDoc.getPage(num).then(page => {
        //set scale
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderCtx = {
            canvasContext: ctx,
            viewport
        }
        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if(pageNumIsPending !== null) {
                renderPage(pageNumIsPending)
                pageNumIsPending = null
            }
        });

        document.querySelector('#page-num').textContent = num
    })
}

//check for pages rendering
const queueRenderPage = num =>{
    if(pageIsRendering) {
        pageNumIsPending = num
    } else {
        renderPage(num)
    }
}

// show prev page
const showPrevPage = () =>{
    if(pageNum <= 1) {
        return
    }
    pageNum--
    queueRenderPage(pageNum)
}

// show next page
const showNextPage = () =>{
    if(pageNum >= pdfDoc.numPages) {
        return
    }
    pageNum++
    queueRenderPage(pageNum)
}

pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_
    console.log(pdfDoc)
    document.querySelector('#page-count').textContent = pdfDoc.numPages
    renderPage(pageNum)
})

//button event
document.querySelector('#pdf-prev').addEventListener('click',showPrevPage)
document.querySelector('#pdf-next').addEventListener('click',showNextPage)

const inputzoom = document.getElementById('zoom')
const formzoom = document.querySelector('form')
function zoomout() {
    scale -= .1
    inputzoom.value = scale
    queueRenderPage(pageNum)
}
function zoomin() {
    scale += .1
    inputzoom.value = scale
    queueRenderPage(pageNum)
}
formzoom.addEventListener('submit',(e)=>{
    e.preventDefault()
    scale = parseFloat(inputzoom.value)
    queueRenderPage(pageNum)
})