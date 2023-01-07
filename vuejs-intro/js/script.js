/*global Vue*/
const { createApp } = Vue

const app01 = createApp({
	data() {
		return {
			  sampleText: 'Hello!',
			  newText: '',
			  visible: true
		}
	},
	methods: {
		toggleVisible() { this.visible = !this.visible; },
		reverseText() { this.sampleText = this.sampleText.split('').reverse().join(''); },
		updateText() { this.sampleText = this.newText; this.newText = ''; }
	}
}).mount('#sample01');

class ListItem {
	constructor(description) {
		this.description = description;
		this.editing = false;
		this.newDescription = '';
	}

	startUpdate() {
		this.newDescription = this.description;
		this.editing = true;
	}

	commitUpdate() {
		if (this.editing && this.newDescription) {
			this.description = this.newDescription;
			this.newDescription = '';
			this.editing = false;
		}
	}

	abortUpdate() {
		this.newDescription = '';
		this.editing = false;
	}
}

const dynamicItem = {
	props: [ 'item' ],
	template: `
		<li class="pa1 lh-copy bt-0 bl-0 br-0 bb b--dashed b--black-50 bg-animate hover-bg-near-white flex items-center">
			<span class="flex-auto" v-if="!item.editing">{{ item.description }}</span>
			<span v-on:click="item.startUpdate()" v-if="!item.editing" class="mr1 pointer dim dn item-control icon icon-edit"></span>
			<span v-on:click="$emit(\'remove\')" v-if="!item.editing" class="mr1 pointer dim dn item-control icon icon-delete"></span>
			<input class="w-100" v-if="item.editing" v-on:keyup.enter="item.commitUpdate()" v-on:keyup.esc="item.abortUpdate()" v-model="item.newDescription" v-focus>
		</li>`
};

const app02 = createApp({
	data() {
		return {
			list: [
				new ListItem('Flour'),
				new ListItem('Sugar'),
				new ListItem('Milk'),
				new ListItem('Eggs'),
				new ListItem('Baking Powder'),
				new ListItem('Vanilla Extract'),
				new ListItem('Sunflower Oil'),
				new ListItem('Salt'),
			],
			newItem: ''
		}
	  },
	methods: {
		addItem() {
			if (this.newItem !== '') {
				this.list.push(new ListItem(this.newItem));
				this.newItem = '';
			}
		}
	},
	components: {
		'dynamic-item': dynamicItem
	}
})
.directive('focus', {
	mounted: (el) => el.focus()
})
.mount('#sample02');
