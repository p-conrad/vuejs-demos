/* vue.js */
function ListItem(value) {
	this.value = +value;
	this.editing = false;
	this.newValue = '';
}

ListItem.prototype = {
	constructor: ListItem,
	startUpdate: function() {
		this.newValue = this.value;
		this.editing = true;
	},
	commitUpdate: function() {
		if (this.editing && this.newValue) {
			this.value = +this.newValue;
			this.newValue = '';
			this.editing = false;
		}
	},
	abortUpdate: function() {
		this.newValue = '';
		this.editing = false;
	}
};

let dynamicItem = {
	props: [ 'item' ],
	template: '<li class="pa1 lh-copy bt-0 bl-0 br-0 bb b--dashed b--black-50 bg-animate hover-bg-near-white flex items-center"><span class="flex-auto" v-if="!item.editing">{{ item.value }}</span>'
		+ '<span v-on:click="item.startUpdate()" v-if="!item.editing" class="mr1 pointer dim dn item-control icon icon-edit"></span>'
		+ '<span v-on:click="$emit(\'remove\')" v-if="!item.editing" class="mr1 pointer dim dn item-control icon icon-delete"></span>'
		+ '<input class="w-100" v-if="item.editing" v-on:keyup.enter="item.commitUpdate()" v-on:keyup.esc="item.abortUpdate()" v-model="item.newValue" v-focus>'
};

Vue.directive('focus', {
	inserted: function(el) { el.focus(); }
})

var sample02 = new Vue({
	el: '#sample02',
	data: {
		list: [
			new ListItem(10),
			new ListItem(50),
			new ListItem(25),
			new ListItem(100),
			new ListItem(78),
			new ListItem(250),
			new ListItem(300),
			new ListItem(150)
		],
		newItem: ''
	},
	methods: {
		addItem: function() {
			if (this.newItem !== '') {
				this.list.push(new ListItem(this.newItem));
				this.newItem = '';
			}
		},
		updateCircles: function() {
			data = this.list.map(e => e.value);
			var size = d3.max(data) * 2;

			var chart = d3.select(".chart")
				.attr("height", size)
				.attr("width", size)

			var selection = chart.selectAll("circle").data(data);

			selection.enter()
				.append("circle")
				.attr("class", "circle")
				.attr("r", 0)
				.attr("cx", size / 2)
				.attr("cy", size / 2)
				.transition()
				.duration(1000)
				.ease(d3.easeCircleOut)
				.attr("r", d => d);

			selection
				.attr("cx", size / 2)
				.attr("cy", size / 2)
				.transition()
				.duration(1000)
				.ease(d3.easeCircleOut)
				.attr("r", d => d);

			selection.exit()
				.attr("cx", size / 2)
				.attr("cy", size / 2)
				.transition()
				.duration(1000)
				.ease(d3.easeCircleIn)
				.attr("r", 0)
				.remove();
		}
	},
	components: {
		'dynamic-item': dynamicItem
	},
	watch: {
		list: function() { this.updateCircles(); } 
	}
});
