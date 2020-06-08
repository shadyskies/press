import Vue from 'vue';
import call from './call';

export default new Vue({
	data() {
		return {
			user: null,
			team: null,
			teams: []
		};
	},
	created() {
		this.fetchAccount();
	},
	methods: {
		async fetchAccount() {
			if (document.cookie.includes('sid=Guest;')) {
				return;
			}
			let team = localStorage.getItem('current_team');
			let result = await call('press.api.account.get', { team });
			this.user = result.user;
			this.team = result.team;
			this.teams = result.teams;
			this.team_members = result.team_members;
			if (this.user.user_image) {
				let url = window.location.origin;
				url = url.replace('8080', '8000');
				this.user.user_image = url + this.user.user_image;
			}
		},
		hasRole(role) {
			let roles = this.user.roles.map(d => d.role);
			return roles.includes(role);
		},
		async switchToTeam(team) {
			if (team === this.team.name) {
				return;
			}
			let result = await this.$call('press.api.account.switch_team', { team });
			this.team = result.team;
			this.team_members = result.team_members;
			localStorage.setItem('current_team', team);
			window.location.reload();
		}
	}
});