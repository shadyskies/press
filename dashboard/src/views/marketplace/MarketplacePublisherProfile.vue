<template>
	<div>
		<div v-if="publisherProfileInfo && !publisherProfileInfo.profile_created">
			<Alert title="You have not created your profile yet.">
				<template #actions>
					<Button appearance="primary" @click="showEditProfileDialog = true"
						>Create</Button
					>
				</template>
			</Alert>
		</div>

		<Button
			v-if="$resources.getPublisherProfileInfo.loading"
			:loading="true"
			loadingText="Loading..."
		></Button>

		<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
			<Card
				v-if="publisherProfileInfo && publisherProfileInfo.profile_created"
				title="Publisher Profile"
				subtitle="Visible on the marketplace website"
			>
				<div class="divide-y-2">
					<ListItem
						title="Display Name"
						:description="displayName || 'Not Set'"
					/>
					<ListItem
						title="Contact Email"
						:description="contactEmail || 'Not Set'"
					/>
					<ListItem title="Website" :description="website || 'Not Set'" />
				</div>

				<template #actions>
					<Button icon-left="edit" @click="showEditProfileDialog = true"
						>Edit</Button
					>
				</template>
			</Card>
		</div>

		<FrappeUIDialog
			:options="{ title: 'Edit Publisher Profile' }"
			v-model="showEditProfileDialog"
		>
			<template v-slot:body-content>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Input label="Display Name" type="text" v-model="displayName" />
					<Input label="Contact Email" type="email" v-model="contactEmail" />
					<Input label="Website" type="text" v-model="website" />
				</div>

				<ErrorMessage
					class="mt-4"
					:error="$resources.updatePublisherProfile.error"
				/>
			</template>

			<template #actions>
				<div class="space-x-2">
					<Button @click="showEditProfileDialog = false">Cancel</Button>
					<Button
						appearance="primary"
						:loading="$resources.updatePublisherProfile.loading"
						loadingText="Saving..."
						@click="$resources.updatePublisherProfile.submit()"
					>
						Save
					</Button>
				</div>
			</template>
		</FrappeUIDialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			showEditProfileDialog: false,
			displayName: '',
			contactEmail: '',
			website: ''
		};
	},
	resources: {
		getPublisherProfileInfo() {
			return {
				method: 'press.api.marketplace.get_publisher_profile_info',
				auto: true,
				onSuccess(data) {
					this.setProfileInfo(data);
				}
			};
		},
		updatePublisherProfile() {
			return {
				method: 'press.api.marketplace.update_publisher_profile',
				params: {
					profile_data: {
						display_name: this.displayName,
						contact_email: this.contactEmail,
						website: this.website
					}
				},
				validate() {
					if (!this.displayName) {
						return 'Display Name is required.';
					}
				},
				onSuccess() {
					this.showEditProfileDialog = false;
					this.$resources.getPublisherProfileInfo.fetch();
				}
			};
		}
	},
	methods: {
		setProfileInfo(data) {
			if (data && data.profile_created) {
				this.displayName = data.profile_info.display_name;
				this.contactEmail = data.profile_info.contact_email;
				this.website = data.profile_info.website;
			}
		}
	},
	computed: {
		publisherProfileInfo() {
			if (
				this.$resources.getPublisherProfileInfo.loading ||
				!this.$resources.getPublisherProfileInfo.data
			) {
				return;
			}

			return this.$resources.getPublisherProfileInfo.data;
		}
	}
};
</script>
