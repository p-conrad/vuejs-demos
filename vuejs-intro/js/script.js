/*global Vue*/
var sample01 = new Vue({
	el: '#sample01',
	data: {
		sampleText: 'Hello!',
		newText: '',
		visible: true
	},
	methods: {
		toggleVisible: function() { this.visible = !this.visible; },
		reverseText: function() { this.sampleText = this.sampleText.split('').reverse().join(''); },
		updateText: function() { this.sampleText = this.newText; this.newText = ''; }
	}
});

function ListItem(description) {
	this.description = description;
	this.editing = false;
	this.newDescription = '';
}

ListItem.prototype = {
	constructor: ListItem,
	startUpdate: function() {
		this.newDescription = this.description;
		this.editing = true;
	},
	commitUpdate: function() {
		if (this.editing && this.newDescription) {
			this.description = this.newDescription;
			this.newDescription = '';
			this.editing = false;
		}
	},
	abortUpdate: function() {
		this.newDescription = '';
		this.editing = false;
	}
};

let dynamicItem = {
	props: [ 'item' ],
	template: '<li class="pa1 lh-copy bt-0 bl-0 br-0 bb b--dashed b--black-50 bg-animate hover-bg-near-white flex items-center"><span class="flex-auto" v-if="!item.editing">{{ item.description }}</span>'
		+ '<span v-on:click="item.startUpdate()" v-if="!item.editing" class="mr1 pointer dim dn item-control icon icon-edit"></span>'
		+ '<span v-on:click="$emit(\'remove\')" v-if="!item.editing" class="mr1 pointer dim dn item-control icon icon-delete"></span>'
		+ '<input class="w-100" v-if="item.editing" v-on:keyup.enter="item.commitUpdate()" v-on:keyup.esc="item.abortUpdate()" v-model="item.newDescription" v-focus>'
};

Vue.directive('focus', {
	inserted: function(el) { el.focus(); }
})

var sample02 = new Vue({
	el: '#sample02',
	data: {
		list: [
			new ListItem('ダミー１'),
			new ListItem('ダミー２')
		],
		newItem: ''
	},
	methods: {
		addItem: function() {
			if (this.newItem !== '') {
				this.list.push(new ListItem(this.newItem));
				this.newItem = '';
			}
		}
	},
	components: {
		'dynamic-item': dynamicItem
	}
});
