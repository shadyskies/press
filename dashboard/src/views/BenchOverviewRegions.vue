<template>
	<Card
		title="Regions"
		subtitle="Regions available for your bench"
		:loading="$resources.regions.loading"
	>
		<template #actions>
			<Button
				v-if="showAddRegionButton"
				@click="
					!$resources.availableRegions.data
						? $resources.availableRegions.fetch()
						: null;
					showAddRegionDialog = true;
				"
			>
				Add Region
			</Button>
		</template>

		<div class="divide-y">
			<ListItem
				v-for="region in $resources.regions.data"
				:key="region.name"
				:title="region.title"
				:image="region.image"
			>
			</ListItem>
		</div>

		<FrappeUIDialog
			:options="{ title: 'Select secondary region for your bench' }"
			v-model="showAddRegionDialog"
		>
			<template v-slot:body-content>
				<LoadingText class="py-2" v-if="$resources.availableRegions.loading" />

				<RichSelect
					:value="selectedRegion"
					@change="selectedRegion = $event"
					:options="regionOptions"
				/>
			</template>

			<template #actions>
				<Button
					appearance="primary"
					v-if="selectedRegion"
					:loading="$resources.addRegion.loading"
					@click="
						$resources.addRegion.submit({
							name: bench.name,
							region: selectedRegion
						})
					"
				>
					Add
				</Button>
			</template>
		</FrappeUIDialog>
	</Card>
</template>

<script>
import RichSelect from '@/components/RichSelect.vue';

export default {
	name: 'BenchOverviewRegions',
	props: ['bench'],
	components: { RichSelect },
	data() {
		return {
			selectedRegion: null,
			showAddRegionDialog: false
		};
	},
	resources: {
		regions() {
			return {
				method: 'press.api.bench.regions',
				params: {
					name: this.bench?.name
				},
				auto: true
			};
		},
		availableRegions() {
			return {
				method: 'press.api.bench.available_regions',
				params: {
					name: this.bench?.name
				},
				auto: true,
				onSuccess(availableRegions) {
					if (availableRegions.length)
						this.selectedRegion = availableRegions[0].name;
				}
			};
		},
		addRegion() {
			return {
				method: 'press.api.bench.add_region',
				onSuccess() {
					window.location.reload();
				}
			};
		}
	},
	computed: {
		regionOptions() {
			let availableRegions = this.$resources.availableRegions.data;
			return availableRegions
				? availableRegions.map(d => ({
						label: d.title,
						value: d.name,
						image: d.image
				  }))
				: [];
		},
		showAddRegionButton() {
			let regions = this.$resources.regions.data;
			return regions && regions.length < 2;
		}
	}
};
</script>
