export function loginAsAdmin(siteName) {
	return {
		method: 'press.api.site.login',
		params: { name: siteName },
		onSuccess(data) {
			if (data?.sid && data?.site) {
				window.open(`https://${data.site}/desk?sid=${data.sid}`, '_blank');
			}
		},
		onError() {
			this.$notify({
				title: 'An error occurred',
				color: 'red',
				icon: 'x'
			});
		}
	};
}
