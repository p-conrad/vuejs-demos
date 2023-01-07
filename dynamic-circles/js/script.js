const { createApp } = Vue

class ListItem {
	constructor(radius) {
		this.radius = radius;
		this.editing = false;
		this.newRadius = 0;
	}

	startUpdate() {
		this.newRadius = this.radius;
		this.editing = true;
	}

	commitUpdate() {
		if (this.editing && this.newRadius) {
			this.radius = this.newRadius;
			this.newRadius = '';
			this.editing = false;
		}
	}

	abortUpdate() {
		this.newRadius = '';
		this.editing = false;
	}
}

const dynamicItem = {
	props: [ 'item' ],
	template: `
		<li class="pa1 lh-copy bt-0 bl-0 br-0 bb b--dashed b--black-50 bg-animate hover-bg-near-white flex items-center">
			<span class="flex-auto" v-if="!item.editing">{{ item.radius }}</span>
			<span v-on:click="item.startUpdate()" v-if="!item.editing" class="mr1 pointer dim dn item-control icon icon-edit"></span>
			<span v-on:click="$emit(\'remove\')" v-if="!item.editing" class="mr1 pointer dim dn item-control icon icon-delete"></span>
			<input class="w-100" v-if="item.editing" v-on:keyup.enter="item.commitUpdate()" v-on:keyup.esc="item.abortUpdate()" v-model="item.newRadius" v-focus>
		</li>`
};

const circlesApp = createApp({
	data() {
		return {
			list: [
				new ListItem(10),
				new ListItem(20),
				new ListItem(30),
				new ListItem(50),
				new ListItem(80),
				new ListItem(130),
				new ListItem(210),
			],
			newItem: ''
		}
	},
	mounted() {
	 this.updateCircles()
	},
	methods: {
		addItem() {
			if (this.newItem !== '') {
				this.list.push(new ListItem(this.newItem));
				this.newItem = '';
			}
		},
		updateCircles() {
			let data = this.list.map(e => e.radius);
			let size = d3.max(data) * 2;

			let chart = d3.select(".chart")
				.attr("height", size)
				.attr("width", size)

			let selection = chart.selectAll("circle").data(data);

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
		list: {
			handler(val, oldVal) {
				this.updateCircles()
			},
			deep: true
		},
	},
})
.directive('focus', {
	mounted: (el) => el.focus()
})
.mount('#app');
