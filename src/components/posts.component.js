import { Component } from '../core/component'
import { apiService } from '../services/api.service'
import { TransformService } from '../services/transform.service'
import { renderPosts } from '../templates/post.template'

export class PostsComponent extends Component {
    constructor(id, { loader }) {
        super(id)
        this.loader = loader
    }

    async onShow() {
        this.loader.show()
        const fbData = await apiService.fetchPosts()
        const posts = TransformService.fbObjectToArray(fbData)
        const html = posts.map(post => renderPosts(post, { withButton : true}))
        this.loader.hide()
        this.$el.insertAdjacentHTML('afterbegin', html.join(' '))
    }

    onHide() {
        this.$el.innerHTML = ''
    }
    init() {
        this.$el.addEventListener('click', buttonHandler.bind(this))
    }
}

function buttonHandler(event) {
    const $el = event.target
    const id = $el.dataset.id
    const title = $el.dataset.title

    if (id) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || []
        const candidate = favorites.find(p => p.id === id)
        if (candidate) {
            //удалить элемент
            favorites = favorites.filter(p => p.id !== id)
            $el.textContent = 'Save'
            $el.classList.add('button-primary')
            $el.classList.remove('button-danger')
        } else {
            //добавить элемент
            favorites.push({id, title})
            $el.textContent = 'Delete'
            $el.classList.remove('button-primary')
            $el.classList.add('button-danger')
        }

        localStorage.setItem('favorites', JSON.stringify(favorites))
    }
}