<template>
	<button
		class="flex w-full flex-row items-center justify-between rounded-lg border border-gray-100 px-4 py-2 shadow focus:outline-none"
		:class="[
			selected || uninstall ? 'ring-2 ring-inset ring-blue-500' : '',
			selectable ? 'hover:border-gray-300' : 'cursor-default'
		]"
		ref="card"
	>
		<div class="flex flex-row items-center gap-2">
			<input
				v-if="selectable"
				@click.self="$refs['card'].click()"
				:checked="selected"
				type="checkbox"
				class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-transparent"
			/>
			<h3 class="text-lg font-medium text-gray-900">
				{{ app.title }}
			</h3>
		</div>
		<Badge v-if="uninstall" color="red"> Will Be Uninstalled </Badge>
		<div v-else class="flex flex-row space-x-2">
			<CommitTag
				v-if="deployFrom(app)"
				:tag="deployFrom(app)"
				:link="`${app.repository_url}/commit/${app.current_hash}`"
			/>
			<a
				v-if="deployFrom(app)"
				class="flex cursor-pointer flex-col justify-center"
				:href="`${app.repository_url}/compare/${app.current_hash}..${app.next_hash}`"
				target="_blank"
			>
				<FeatherIcon name="arrow-right" class="w-4" />
			</a>
			<Badge color="green" v-else>First Deploy</Badge>
			<CommitTag
				:tag="deployTo(app)"
				:link="`${app.repository_url}/commit/${app.next_hash}`"
			/>
		</div>
	</button>
</template>

<script>
import CommitTag from './utils/CommitTag.vue';
export default {
	name: 'AppUpdateCard',
	props: ['app', 'selectable', 'selected', 'uninstall'],
	methods: {
		deployFrom(app) {
			if (app.will_branch_change) {
				return app.current_branch;
			}
			return app.current_hash
				? app.current_tag || app.current_hash.slice(0, 7)
				: null;
		},
		deployTo(app) {
			if (app.will_branch_change) {
				return app.branch;
			}
			return app.next_tag || app.next_hash.slice(0, 7);
		}
	},
	components: { CommitTag }
};
</script>
